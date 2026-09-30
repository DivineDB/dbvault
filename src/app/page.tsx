"use client";

import { useState, useEffect, useCallback } from "react";
import { VaultItem } from "@/types/vault";
import { INITIAL_VAULT_ITEMS } from "@/lib/initial-data";
import { Header } from "@/components/Header";
import { CategoryNav, FilterCategory } from "@/components/CategoryNav";
import { VaultItemCard } from "@/components/VaultItemCard";
import { VaultItemList } from "@/components/VaultItemList";
import { UploadModal } from "@/components/UploadModal";
import { ItemViewerModal } from "@/components/ItemViewerModal";
import { SettingsModal } from "@/components/SettingsModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import {
  Inbox,
  ArrowUpDown,
  Plus,
  RotateCcw,
  Trash2,
  CloudCheck,
  CloudOff,
  RefreshCw,
} from "lucide-react";

export default function VaultHomePage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

  // Sync to API and LocalStorage
  const syncVaultState = useCallback(async (newItems: VaultItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("dbvault_items_v2", JSON.stringify(newItems));
    } catch (e) {
      console.error("Local save error:", e);
    }

    setSyncStatus("syncing");
    try {
      await fetch("/api/vault/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newItems }),
      });
      setSyncStatus("synced");
    } catch (err) {
      setSyncStatus("offline");
    }
  }, []);

  // Fetch initial state from Server & LocalStorage
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/vault/items");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setItems(data.items);
            localStorage.setItem("dbvault_items_v2", JSON.stringify(data.items));
            setLoaded(true);
            return;
          }
        }
      } catch (e) {
        console.warn("Using local cache fallback");
      }

      // LocalStorage fallback
      try {
        const saved = localStorage.getItem("dbvault_items_v2");
        if (saved) {
          setItems(JSON.parse(saved));
        } else {
          setItems(INITIAL_VAULT_ITEMS);
          localStorage.setItem("dbvault_items_v2", JSON.stringify(INITIAL_VAULT_ITEMS));
        }
      } catch (e) {
        setItems(INITIAL_VAULT_ITEMS);
      } finally {
        setLoaded(true);
      }
    }

    loadData();
  }, []);

  // Item Actions
  const handleAddItem = (newItem: VaultItem) => {
    syncVaultState([newItem, ...items]);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    syncVaultState(updated);
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({ ...selectedItem, isFavorite: !selectedItem.isFavorite });
    }
  };

  // Soft Delete (Move to Trash) or Permanent Delete if already in Trash
  const handleDeleteItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    if (target.inTrash) {
      // Permanent delete
      const updated = items.filter((item) => item.id !== id);
      syncVaultState(updated);
    } else {
      // Move to Trash
      const updated = items.map((item) =>
        item.id === id ? { ...item, inTrash: true } : item
      );
      syncVaultState(updated);
    }
  };

  // Restore from Trash
  const handleRestoreItem = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, inTrash: false } : item
    );
    syncVaultState(updated);
  };

  // Empty Trash permanently
  const handleEmptyTrash = () => {
    if (confirm("Permanently empty all items in trash?")) {
      const updated = items.filter((i) => !i.inTrash);
      syncVaultState(updated);
    }
  };

  const handleResetVault = () => {
    syncVaultState(INITIAL_VAULT_ITEMS);
  };

  // Focus mobile search
  const handleFocusMobileSearch = () => {
    const el = document.getElementById("vault-search-input");
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Calculate counts
  const categoryCounts: Record<FilterCategory, number> = {
    all: items.filter((i) => !i.inTrash).length,
    photo: items.filter((i) => i.category === "photo" && !i.inTrash).length,
    document: items.filter((i) => i.category === "document" && !i.inTrash).length,
    note: items.filter((i) => i.category === "note" && !i.inTrash).length,
    secret: items.filter((i) => i.category === "secret" && !i.inTrash).length,
    favorite: items.filter((i) => i.isFavorite && !i.inTrash).length,
    trash: items.filter((i) => i.inTrash).length,
  };

  // Filtered & Sorted Items
  const filteredItems = items
    .filter((item) => {
      // Trash handling
      if (activeCategory === "trash") {
        if (!item.inTrash) return false;
      } else {
        if (item.inTrash) return false;

        if (activeCategory === "favorite") {
          if (!item.isFavorite) return false;
        } else if (activeCategory !== "all") {
          if (item.category !== activeCategory) return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchesContent = item.content?.toLowerCase().includes(q);
        return matchesTitle || matchesTags || matchesContent;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "size") return (b.size || 0) - (a.size || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalBytes = items
    .filter((i) => !i.inTrash)
    .reduce((acc, curr) => acc + (curr.size || 0), 0);
  const totalSizeFormatted = (totalBytes / (1024 * 1024)).toFixed(1) + " MB";

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#08090d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Initializing High-Speed Sync...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-slate-100 pb-20 sm:pb-8">
      {/* Background Ambient Blur */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalSizeFormatted={totalSizeFormatted}
        totalItemsCount={categoryCounts.all}
      />

      {/* Sync Status Floating Indicator */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {syncStatus === "synced" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <CloudCheck className="w-3.5 h-3.5" /> Cloud Synced
            </span>
          )}
          {syncStatus === "syncing" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing...
            </span>
          )}
          {syncStatus === "offline" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono">
              <CloudOff className="w-3.5 h-3.5" /> Local Encrypted
            </span>
          )}
        </div>

        {activeCategory === "trash" && categoryCounts.trash > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Trash ({categoryCounts.trash})</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-4 space-y-6 relative z-10">
        {/* Category Navbar & Sorting Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-2">
          <CategoryNav
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={categoryCounts}
          />

          {/* Sort selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-slate-400" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#121420] border border-white/10 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
            >
              <option value="date">Newest First</option>
              <option value="name">Title (A-Z)</option>
              <option value="size">Size (Largest)</option>
            </select>
          </div>
        </div>

        {/* Display Items */}
        {filteredItems.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center my-12 border border-white/5 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                No items found
              </h3>
              <p className="text-xs text-slate-400">
                {searchQuery
                  ? `No vault items match "${searchQuery}"`
                  : activeCategory === "trash"
                  ? "Trash bin is empty."
                  : "This category is currently empty in your personal vault."}
              </p>
            </div>
            {activeCategory !== "trash" && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative group/wrapper">
                <VaultItemCard
                  item={item}
                  onView={setSelectedItem}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteItem}
                />
                {item.inTrash && (
                  <button
                    onClick={() => handleRestoreItem(item.id)}
                    className="absolute top-2 right-12 z-20 px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-[10px] font-medium flex items-center gap-1 transition-all"
                    title="Restore item"
                  >
                    <RotateCcw className="w-3 h-3" /> Restore
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <VaultItemList
            items={filteredItems}
            onView={setSelectedItem}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteItem}
          />
        )}
      </main>

      {/* Mobile Bottom Dock Bar */}
      <MobileBottomNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={handleFocusMobileSearch}
      />

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddItem={handleAddItem}
      />

      <ItemViewerModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteItem}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        items={items}
        onResetVault={handleResetVault}
      />
    </div>
  );
}
