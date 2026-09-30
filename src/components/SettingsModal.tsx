"use client";

import { VaultItem } from "@/types/vault";
import {
  X,
  HardDrive,
  Download,
  RotateCcw,
  ShieldCheck,
  KeyRound,
  Database,
  Lock,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: VaultItem[];
  onResetVault: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  items,
  onResetVault,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const totalBytes = items.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const formattedTotal = (totalBytes / (1024 * 1024)).toFixed(2);

  const photosCount = items.filter((i) => i.category === "photo").length;
  const docsCount = items.filter((i) => i.category === "document").length;
  const notesCount = items.filter((i) => i.category === "note").length;
  const secretsCount = items.filter((i) => i.category === "secret").length;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `divyansh_vault_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Vault Storage & Security
              </h2>
              <p className="text-xs text-slate-400">
                Divyansh Personal Vault Management
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

        {/* Content */}
        <div className="space-y-6">
          {/* Storage Usage Bar */}
          <div className="p-4 rounded-2xl bg-[#121420] border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Storage Used</span>
              </span>
              <span className="font-mono text-indigo-300 font-bold">
                {formattedTotal} MB / 5 GB
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
              <div className="h-full bg-cyan-400" style={{ width: `${Math.min(photosCount * 15, 60)}%` }} />
              <div className="h-full bg-amber-400" style={{ width: `${Math.min(docsCount * 10, 30)}%` }} />
              <div className="h-full bg-indigo-400" style={{ width: `${Math.min(notesCount * 5, 20)}%` }} />
            </div>
            <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-400 font-mono text-center pt-1">
              <div>📷 {photosCount} Photos</div>
              <div>📄 {docsCount} Docs</div>
              <div>📝 {notesCount} Notes</div>
              <div>🔑 {secretsCount} Keys</div>
            </div>
          </div>

          {/* Master Password Security Status */}
          <div className="p-4 rounded-2xl bg-[#121420] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authentication Configured</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Master password active (<code className="text-indigo-300 font-mono">hellodb</code>). HTTP-Only session cookies enabled.
            </p>
          </div>

          {/* Backup & Actions */}
          <div className="space-y-2">
            <button
              onClick={handleExportJSON}
              className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Vault JSON Backup</span>
            </button>

            <button
              onClick={() => {
                if (confirm("Reset vault to initial sample data?")) {
                  onResetVault();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Vault Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
