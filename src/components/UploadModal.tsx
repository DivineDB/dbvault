"use client";

import { useState } from "react";
import { VaultItem, ItemCategory } from "@/types/vault";
import {
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  StickyNote,
  Key,
  Plus,
  Sparkles,
  Tag,
} from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: VaultItem) => void;
}

export function UploadModal({
  isOpen,
  onClose,
  onAddItem,
}: UploadModalProps) {
  const [tab, setTab] = useState<ItemCategory>("photo");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }

      // Read as Data URL for persistent browser storage & offline preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploading(true);

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const newItem: VaultItem = {
      id: `item-${Date.now()}`,
      title: title.trim(),
      category: tab,
      fileType: file ? file.type || file.name.split(".").pop() : tab === "note" ? "text/markdown" : "secret",
      size: file ? file.size : content.length,
      content: previewUrl || content,
      thumbnailUrl: tab === "photo" ? previewUrl || undefined : undefined,
      tags: parsedTags.length > 0 ? parsedTags : [tab, "personal"],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddItem(newItem);
    setUploading(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTagsInput("");
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-indigo-950/40">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Add to Divyansh Vault
              </h2>
              <p className="text-xs text-slate-400">
                Upload photos, documents, or create secure notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6 p-1 bg-[#121420] rounded-xl border border-white/5">
          {[
            { id: "photo", label: "Photo", icon: ImageIcon },
            { id: "document", label: "Doc", icon: FileText },
            { id: "note", label: "Note", icon: StickyNote },
            { id: "secret", label: "Secret", icon: Key },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = tab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setTab(cat.id as ItemCategory)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Zone for Photo & Document */}
          {(tab === "photo" || tab === "document") && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Choose File
              </label>
              <div className="relative border-2 border-dashed border-white/15 hover:border-indigo-500/50 rounded-2xl p-6 text-center bg-[#121420]/50 transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept={tab === "photo" ? "image/*" : ".pdf,.doc,.docx,.txt,.csv,.xlsx"}
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {file ? (
                  <div className="space-y-2">
                    {previewUrl && tab === "photo" ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-24 h-24 mx-auto rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <FileText className="w-10 h-10 text-indigo-400 mx-auto" />
                    )}
                    <p className="text-xs font-medium text-indigo-300">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 mx-auto transition-colors" />
                    <p className="text-xs font-medium text-slate-300">
                      Click to browse or drag file here
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Supports JPG, PNG, PDF, Docs up to 25MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Title / Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Driver License Scan, Project API Key"
              required
              className="w-full px-4 py-2.5 bg-[#121420] border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Text/Content input for Note & Secret */}
          {(tab === "note" || tab === "secret") && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {tab === "note" ? "Note Content (Markdown Supported)" : "Secret / Password Value"}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  tab === "note"
                    ? "Write your private note or code snippet here..."
                    : "e.g. sk_live_51M0x... or master_pass_2026"
                }
                rows={4}
                required
                className="w-full px-4 py-2.5 bg-[#121420] border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>
          )}

          {/* Tags Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tags (comma separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="work, finance, passport, identity"
              className="w-full px-4 py-2 bg-[#121420] border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !title.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-medium rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Save to Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
