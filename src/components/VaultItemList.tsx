"use client";

import { useState } from "react";
import { VaultItem } from "@/types/vault";
import {
  Image as ImageIcon,
  FileText,
  StickyNote,
  Key,
  Star,
  Trash2,
  Eye,
  Copy,
  Check,
} from "lucide-react";

interface VaultItemListProps {
  items: VaultItem[];
  onView: (item: VaultItem) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function VaultItemList({
  items,
  onView,
  onToggleFavorite,
  onDelete,
}: VaultItemListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "--";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleCopy = (e: React.MouseEvent, item: VaultItem) => {
    e.stopPropagation();
    if (item.content) {
      navigator.clipboard.writeText(item.content);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "photo":
        return <ImageIcon className="w-4 h-4 text-cyan-400" />;
      case "document":
        return <FileText className="w-4 h-4 text-amber-400" />;
      case "note":
        return <StickyNote className="w-4 h-4 text-indigo-400" />;
      case "secret":
        return <Key className="w-4 h-4 text-rose-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#121420] text-slate-400 border-b border-white/5 uppercase tracking-wider font-mono">
              <th className="py-3 px-4 w-10 text-center">Star</th>
              <th className="py-3 px-4">Title & Type</th>
              <th className="py-3 px-4 hidden md:table-cell">Tags</th>
              <th className="py-3 px-4 hidden sm:table-cell">Size</th>
              <th className="py-3 px-4 hidden sm:table-cell">Date</th>
              <th className="py-3 px-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => onView(item)}
                className="hover:bg-indigo-500/5 transition-colors cursor-pointer group"
              >
                {/* Star toggle */}
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      item.isFavorite ? "text-amber-400" : "text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                </td>

                {/* Title & Icon */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0">
                      {getIcon(item.category)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono capitalize">
                        {item.category} {item.fileType ? `• ${item.fileType}` : ""}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Tags */}
                <td className="py-3 px-4 hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-400 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </td>

                {/* File size */}
                <td className="py-3 px-4 font-mono text-slate-400 hidden sm:table-cell">
                  {formatFileSize(item.size)}
                </td>

                {/* Date */}
                <td className="py-3 px-4 font-mono text-slate-500 hidden sm:table-cell">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    {item.content && (
                      <button
                        onClick={(e) => handleCopy(e, item)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Copy content"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(item);
                      }}
                      className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                      title="View item"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
