"use client";

import { useState } from "react";
import { VaultItem } from "@/types/vault";
import {
  X,
  Star,
  Trash2,
  Copy,
  Check,
  Download,
  Eye,
  EyeOff,
  Tag,
  Calendar,
  HardDrive,
  FileText,
  Key,
  Image as ImageIcon,
  StickyNote,
} from "lucide-react";

interface ItemViewerModalProps {
  item: VaultItem | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ItemViewerModal({
  item,
  onClose,
  onToggleFavorite,
  onDelete,
}: ItemViewerModalProps) {
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  if (!item) return null;

  const handleCopyContent = () => {
    if (item.content) {
      navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!item.content && !item.thumbnailUrl) return;

    const url = item.content || item.thumbnailUrl!;
    const a = document.createElement("a");
    a.href = url;
    a.download = item.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black my-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#0f111a]/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleFavorite(item.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                item.isFavorite
                  ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                  : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
              }`}
              title="Star item"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1">
                {item.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                <span className="capitalize">{item.category}</span>
                <span>•</span>
                <span>{formatFileSize(item.size)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(item.category === "photo" || item.category === "document") && (
              <button
                onClick={handleDownload}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                title="Download file"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
            <button
              onClick={() => {
                onDelete(item.id);
                onClose();
              }}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Photo Preview */}
          {item.category === "photo" && (item.content || item.thumbnailUrl) && (
            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center p-2 min-h-[300px]">
              <img
                src={item.content || item.thumbnailUrl}
                alt={item.title}
                className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>
          )}

          {/* Document Preview */}
          {item.category === "document" && (
            <div className="p-8 rounded-2xl bg-[#121420] border border-white/10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {item.fileType} • {formatFileSize(item.size)}
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl text-xs font-medium shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Open / Save Document</span>
              </button>
            </div>
          )}

          {/* Note Reader */}
          {item.category === "note" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5 text-indigo-400" />
                  Text / Markdown Content
                </span>
                <button
                  onClick={handleCopyContent}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-[#0c0e16] border border-white/10 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {item.content || "Empty note"}
              </div>
            </div>
          )}

          {/* Secret Credentials */}
          {item.category === "secret" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#0c0e16] border border-rose-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-mono">
                    <Key className="w-4 h-4" />
                    <span>Encrypted Secret Key</span>
                  </div>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="px-3 py-1 rounded-lg bg-white/5 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {showSecret ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Reveal</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-sm tracking-wider flex items-center justify-between">
                  <span className="text-rose-300 select-all break-all">
                    {showSecret ? item.content : "••••••••••••••••••••••••••••••••"}
                  </span>
                  <button
                    onClick={handleCopyContent}
                    className="p-2 text-indigo-400 hover:text-indigo-300 shrink-0 ml-2"
                    title="Copy Secret"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-1 font-mono">Created Date</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1 font-mono">File Size</span>
              <span className="text-slate-300 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                {formatFileSize(item.size)}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 block mb-1 font-mono">Tags</span>
              <div className="flex items-center gap-1 flex-wrap">
                {item.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
