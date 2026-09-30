"use client";

import { useState, useEffect } from "react";
import { VaultItem } from "@/types/vault";
import { INITIAL_VAULT_ITEMS } from "@/lib/initial-data";
import { Header } from "@/components/Header";
import { CategoryNav, FilterCategory } from "@/components/CategoryNav";
import { VaultItemCard } from "@/components/VaultItemCard";
import { VaultItemList } from "@/components/VaultItemList";
import { UploadModal } from "@/components/UploadModal";
import { ItemViewerModal } from "@/components/ItemViewerModal";
import { SettingsModal } from "@/components/SettingsModal";
import {
  Shield,
  Search,
  Plus,
  Lock,
  Sparkles,
  Inbox,
  ArrowUpDown,
  Filter,
} from "lucide-react";

export default function VaultHomePage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

  // Load items from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dbvault_items_v1");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems(INITIAL_VAULT_ITEMS);
        localStorage.setItem("dbvault_items_v1", JSON.stringify(INITIAL_VAULT_ITEMS));
      }
    } catch (e) {
      setItems(INITIAL_VAULT_ITEMS);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever items change
  const updateItems = (newItems: VaultItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("dbvault_items_v1", JSON.stringify(newItems));
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
  };

  // Item Handlers
  const handleAddItem = (newItem: VaultItem) => {
    updateItems([newItem, ...items]);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    updateItems(updated);
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({ ...selectedItem, isFavorite: !selectedItem.isFavorite });
    }
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    updateItems(updated);
  };

  const handleResetVault = () => {
    updateItems(INITIAL_VAULT_ITEMS);
  };

  // Calculate counts for categories
  const categoryCounts: Record<FilterCategory, number> = {
    all: items.length,
    photo: items.filter((i) => i.category === "photo").length,
    document: items.filter((i) => i.category === "document").length,
    note: items.filter((i) => i.category === "note").length,
    secret: items.filter((i) => i.category === "secret").length,
    favorite: items.filter((i) => i.isFavorite).length,
  };

  // Filtered & Sorted Items
  const filteredItems = items
    .filter((item) => {
      // Category filter
      if (activeCategory === "favorite") {
        if (!item.isFavorite) return false;
      } else if (activeCategory !== "all") {
        if (item.category !== activeCategory) return false;
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
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "size") {
        return (b.size || 0) - (a.size || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Calculate total size formatted
  const totalBytes = items.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const totalSizeFormatted = (totalBytes / (1024 * 1024)).toFixed(1) + " MB";

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#08090d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Decrypting Vault...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-slate-100">
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
        totalItemsCount={items.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 relative z-10">
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
              <option value="date font-mono">Newest First</option>
              <option value="name font-mono">Title (A-Z)</option>
              <option value="size font-mono">Size (Largest)</option>
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
                  : "This category is currently empty in your personal vault."}
              </p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <VaultItemCard
                key={item.id}
                item={item}
                onView={setSelectedItem}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteItem}
              />
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

      {/* Footer info */}
      <footer className="py-6 text-center text-xs text-slate-600 font-mono border-t border-white/5 mt-auto">
        <p>Divyansh Personal Vault • Encrypted Local Sync • Vercel Ready</p>
      </footer>

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
