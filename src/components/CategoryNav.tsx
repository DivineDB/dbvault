"use client";

import { ItemCategory } from "@/types/vault";
import {
  Layers,
  Image as ImageIcon,
  FileText,
  StickyNote,
  Key,
  Star,
  Trash2,
} from "lucide-react";

export type FilterCategory = ItemCategory | "all" | "favorite" | "trash";

interface CategoryNavProps {
  activeCategory: FilterCategory;
  onSelectCategory: (cat: FilterCategory) => void;
  counts: Record<FilterCategory, number>;
}

export function CategoryNav({
  activeCategory,
  onSelectCategory,
  counts,
}: CategoryNavProps) {
  const categories: { id: FilterCategory; label: string; icon: any }[] = [
    { id: "all", label: "All Items", icon: Layers },
    { id: "photo", label: "Photos", icon: ImageIcon },
    { id: "document", label: "Documents", icon: FileText },
    { id: "note", label: "Notes", icon: StickyNote },
    { id: "secret", label: "Secrets", icon: Key },
    { id: "favorite", label: "Starred", icon: Star },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  return (
    <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        const count = counts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? cat.id === "trash"
                  ? "bg-red-500/80 text-white shadow-lg shadow-red-500/20 border border-red-400/50"
                  : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500/50"
                : "bg-[#121420]/70 hover:bg-[#181b2c] text-slate-400 hover:text-slate-200 border border-white/5"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 ${
                isActive
                  ? "text-white"
                  : cat.id === "trash"
                  ? "text-red-400"
                  : "text-indigo-400"
              }`}
            />
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
