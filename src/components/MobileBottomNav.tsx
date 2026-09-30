"use client";

import { FilterCategory } from "@/components/CategoryNav";
import {
  Layers,
  Star,
  Plus,
  HardDrive,
  Lock,
  Search,
} from "lucide-react";

interface MobileBottomNavProps {
  activeCategory: FilterCategory;
  onSelectCategory: (cat: FilterCategory) => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

export function MobileBottomNav({
  activeCategory,
  onSelectCategory,
  onOpenUpload,
  onOpenSettings,
  onOpenSearch,
}: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#0a0c14]/90 backdrop-blur-2xl border-t border-white/10 px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around relative">
        {/* All Items */}
        <button
          onClick={() => onSelectCategory("all")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeCategory === "all"
              ? "text-indigo-400 font-semibold"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Vault</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => onSelectCategory("favorite")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeCategory === "favorite"
              ? "text-amber-400 font-semibold"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Star className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Starred</span>
        </button>

        {/* Center Floating Plus Action Button */}
        <div className="relative -top-5">
          <button
            onClick={onOpenUpload}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 border-2 border-[#08090d] active:scale-95 transition-transform cursor-pointer"
            title="Add to Vault"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Search</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
        >
          <HardDrive className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Manage</span>
        </button>
      </div>
    </div>
  );
}
