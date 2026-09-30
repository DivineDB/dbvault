"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Search,
  Plus,
  Lock,
  HardDrive,
  Grid,
  List,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  totalSizeFormatted: string;
  totalItemsCount: number;
}

export function Header({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onOpenUpload,
  onOpenSettings,
  totalSizeFormatted,
  totalItemsCount,
}: HeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLock = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#08090d]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0d0f18] rounded-[15px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-lg sm:text-xl">
                Divyansh<span className="text-indigo-400">Vault</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Personal Storage • {totalItemsCount} items ({totalSizeFormatted})
            </p>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="vault-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files, photos, notes, tags..."
              className="w-full pl-10 pr-4 py-2 bg-[#121420]/90 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Add Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Add Item</span>
          </button>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center bg-[#121420] border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Storage / Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[#121420] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            title="Vault Storage & Settings"
          >
            <HardDrive className="w-4 h-4" />
          </button>

          {/* Lock / Logout */}
          <button
            onClick={handleLock}
            disabled={loggingOut}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer"
            title="Lock Vault"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
