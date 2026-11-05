import React, { useState } from 'react';
import { ShieldCheck, HardDrive, RefreshCw, PlusCircle, Search, Laptop, Download, Check } from 'lucide-react';
import { downloadWpfProjectZip } from '../utils/zipGenerator';

interface WindowHeaderProps {
  totalDrives: number;
  encryptedDrives: number;
  decryptingDrives: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onAddDevice: () => void;
  isRefreshing: boolean;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  totalDrives,
  encryptedDrives,
  decryptingDrives,
  searchQuery,
  onSearchChange,
  onRefresh,
  onAddDevice,
  isRefreshing
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const success = await downloadWpfProjectZip();
    setIsDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  return (
    <header className="bg-[#0b0e17] border-b border-[#1b2234] px-4 py-2.5 flex items-center justify-between gap-4 select-none">
      {/* Brand & UAC Shield */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.25)]">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white">
              BitLocker Administrator Pro
            </h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300">
              UAC ELEVATED
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Windows 10 / 11 Desktop</span>
            <span aria-hidden="true">·</span>
            <span>manage-bde v10.0</span>
            {decryptingDrives > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-medium animate-pulse">
                  {decryptingDrives} drive sedang didekripsi
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-md w-full relative hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari drive (misal C:, Kingston, SSD, Terkunci)..."
          className="w-full bg-[#121826] border border-[#20293d] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
          >
            ×
          </button>
        )}
      </div>

      {/* Actions & Window Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Direct Download ZIP Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap"
          title="Unduh seluruh file proyek C# WPF .NET 8 dalam bentuk ZIP untuk dijalankan di Windows"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>ZIP Terunduh!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Menyiapkan...' : 'Download ZIP Windows'}</span>
            </>
          )}
        </button>

        <button
          onClick={onAddDevice}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172133] hover:bg-[#1f2d45] border border-[#273652] text-xs font-medium text-slate-200 rounded-lg transition-colors whitespace-nowrap hidden sm:flex"
          title="Simulasi tancapkan perangkat USB atau Hardisk baru"
        >
          <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
          <span>Pasang USB Baru</span>
        </button>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          title="Jalankan 'manage-bde -status' untuk memindai semua drive"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Drive</span>
        </button>

        {/* Windows Chrome Simulated Buttons */}
        <div className="flex items-center gap-1 ml-2 border-l border-slate-800 pl-3">
          <div className="w-3 h-3 rounded-full bg-slate-700/60" title="Minimize" />
          <div className="w-3 h-3 rounded-full bg-slate-700/60" title="Maximize" />
          <div className="w-3 h-3 rounded-full bg-rose-600/70" title="Close" />
        </div>
      </div>
    </header>
  );
};
