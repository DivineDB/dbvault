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
  ExternalLink,
} from "lucide-react";

interface VaultItemCardProps {
  item: VaultItem;
  onView: (item: VaultItem) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function VaultItemCard({
  item,
  onView,
  onToggleFavorite,
  onDelete,
}: VaultItemCardProps) {
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.content) {
      navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderCategoryBadge = () => {
    switch (item.category) {
      case "photo":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-medium border border-cyan-500/20">
            <ImageIcon className="w-3 h-3" /> Photo
          </span>
        );
      case "document":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-medium border border-amber-500/20">
            <FileText className="w-3 h-3" /> Doc
          </span>
        );
      case "note":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-medium border border-indigo-500/20">
            <StickyNote className="w-3 h-3" /> Note
          </span>
        );
      case "secret":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-medium border border-rose-500/20">
            <Key className="w-3 h-3" /> Secret
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onView(item)}
      className="group glass-card rounded-2xl p-4 flex flex-col justify-between cursor-pointer border border-white/5 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
    >
      {/* Top Media / Thumbnail Preview */}
      {item.category === "photo" && (item.content || item.thumbnailUrl) && (
        <div className="relative w-full h-40 mb-3 rounded-xl overflow-hidden bg-black/40 border border-white/5">
          <img
            src={item.content || item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
            <span className="text-[10px] text-white/80 font-mono">
              {item.metadata?.dimensions || "Image"}
            </span>
            <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Top Header info */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {renderCategoryBadge()}
          {item.size && (
            <span className="text-[10px] text-slate-500 font-mono">
              {formatFileSize(item.size)}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            item.isFavorite
              ? "text-amber-400 bg-amber-400/10"
              : "text-slate-600 hover:text-slate-300 hover:bg-white/5"
          }`}
          title={item.isFavorite ? "Unstar item" : "Star item"}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-100 text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors mb-2">
        {item.title}
      </h3>

      {/* Content Preview Snippet for Notes/Secrets */}
      {item.category === "note" && item.content && (
        <p className="text-xs text-slate-400 line-clamp-3 font-mono bg-[#0d0f18] p-2.5 rounded-xl border border-white/5 mb-3 leading-relaxed">
          {item.content}
        </p>
      )}

      {item.category === "secret" && item.content && (
        <div className="mb-3 bg-[#0d0f18] p-2.5 rounded-xl border border-rose-500/20 flex items-center justify-between">
          <span className="text-xs text-rose-300 font-mono tracking-wider">
            {showSecret ? item.content : "••••••••••••••••"}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSecret(!showSecret);
              }}
              className="p-1 text-slate-400 hover:text-slate-200 text-[10px]"
            >
              {showSecret ? "Hide" : "Show"}
            </button>
            <button
              onClick={handleCopy}
              className="p-1 text-indigo-400 hover:text-indigo-300"
              title="Copy secret value"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Footer Tags & Actions */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 text-[11px] text-slate-500">
        <div className="flex items-center gap-1 overflow-hidden">
          {item.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
              #{tag}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="text-[10px] text-slate-600">+{item.tags.length - 2}</span>
          )}
        </div>

        {/* Delete action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
