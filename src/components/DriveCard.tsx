import React from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldOff, 
  HardDrive, 
  Usb, 
  Cpu, 
  Pause, 
  Play, 
  Terminal, 
  Info,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { DriveItem } from '../types/bitlocker';
import { formatBytes } from '../services/commandSimulator';

interface DriveCardProps {
  drive: DriveItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpenUnlock: (drive: DriveItem) => void;
  onOpenDecrypt: (drive: DriveItem) => void;
  onPauseResumeDecrypt: (drive: DriveItem) => void;
  onToggleEncrypt: (drive: DriveItem) => void;
}

export const DriveCard: React.FC<DriveCardProps> = ({
  drive,
  isSelected,
  onSelect,
  onOpenUnlock,
  onOpenDecrypt,
  onPauseResumeDecrypt,
  onToggleEncrypt
}) => {
  const isLocked = drive.lockStatus === 'Locked';
  const isDecrypting = drive.bitlockerStatus === 'Sedang Dekripsi';
  const isPaused = drive.bitlockerStatus === 'Dekripsi Dijeda';
  const isEncryptedUnlocked = drive.bitlockerStatus === 'Terenkripsi (Terbuka)';
  const isOff = drive.bitlockerStatus === 'Tidak Terenkripsi (Off)';

  const usedPercent = drive.totalSizeBytes > 0 
    ? Math.min(100, Math.round((drive.usedSizeBytes / drive.totalSizeBytes) * 100))
    : 0;

  // Icon based on device type
  const renderDeviceIcon = () => {
    switch (drive.deviceType) {
      case 'USB Flashdisk':
        return <Usb className="w-5 h-5 text-cyan-400" />;
      case 'SSD Eksternal':
      case 'SSD Internal':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      default:
        return <HardDrive className="w-5 h-5 text-slate-300" />;
    }
  };

  // Status badge styling
  const renderStatusBadge = () => {
    if (isLocked) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-300">
          <Lock className="w-3.5 h-3.5 text-rose-400" />
          <span>Terkunci</span>
        </span>
      );
    }
    if (isDecrypting) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Dekripsi ({drive.decryptionPercent}%)</span>
        </span>
      );
    }
    if (isPaused) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
          <Pause className="w-3.5 h-3.5 text-amber-400" />
          <span>Dekripsi Dijeda</span>
        </span>
      );
    }
    if (isEncryptedUnlocked) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Terenkripsi (Terbuka)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-400">
        <ShieldOff className="w-3.5 h-3.5" />
        <span>Tidak Terenkripsi</span>
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelect(drive.id)}
      className={`relative rounded-xl transition-all duration-200 border cursor-pointer select-none overflow-hidden ${
        isSelected
          ? 'bg-[#151c2a] border-blue-500/80 shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/50'
          : 'bg-[#111622] hover:bg-[#141b28] border-[#1d263b] hover:border-[#2b3752]'
      }`}
    >
      {/* Top Accent line if selected */}
      {isSelected && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />}

      <div className="p-4 space-y-3.5">
        {/* Header row: Icon, Letter, Name, Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#182133] border border-[#26334f] flex items-center justify-center shrink-0">
              {renderDeviceIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-white">
                  {drive.letter}
                </span>
                <span className="text-sm font-semibold text-slate-200 truncate max-w-[150px]" title={drive.volumeLabel}>
                  {drive.volumeLabel}
                </span>
                {drive.isSystemDrive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                    SYSTEM
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{drive.deviceType}</span>
                <span aria-hidden="true">·</span>
                <span>{drive.fileSystem}</span>
              </div>
            </div>
          </div>
          <div>{renderStatusBadge()}</div>
        </div>

        {/* Capacity Storage Gauge */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              {formatBytes(drive.usedSizeBytes)} terpakai dari {formatBytes(drive.totalSizeBytes)}
            </span>
            <span className="text-slate-300 font-semibold">{usedPercent}%</span>
          </div>
          <div className="h-2 w-full bg-[#182030] rounded-full overflow-hidden border border-[#212b40]">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                usedPercent > 90
                  ? 'bg-rose-500'
                  : usedPercent > 75
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${usedPercent}%` }}
            />
          </div>
        </div>

        {/* Real-time Decryption Progress if in progress */}
        {(isDecrypting || isPaused) && (
          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Proses Dekripsi BitLocker
              </span>
              <span className="font-mono text-amber-200 font-bold">
                {drive.decryptionPercent}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${drive.decryptionPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Technical Metadata Row */}
        <div className="pt-2 border-t border-[#1b2438] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <KeyRound className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">
              {drive.encryptionMethod !== 'None' ? drive.encryptionMethod : 'Proteksi Nonaktif'}
            </span>
          </div>
          <span className="font-mono text-slate-500 shrink-0">
            {drive.protectors.length} Protector
          </span>
        </div>

        {/* Quick Actions Row */}
        <div className="pt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {isLocked && (
            <button
              onClick={() => onOpenUnlock(drive)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Buka Kunci (Unlock)</span>
            </button>
          )}

          {isEncryptedUnlocked && (
            <button
              onClick={() => onOpenDecrypt(drive)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <ShieldOff className="w-3.5 h-3.5" />
              <span>Matikan BitLocker</span>
            </button>
          )}

          {isDecrypting && (
            <button
              onClick={() => onPauseResumeDecrypt(drive)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Jeda Dekripsi</span>
            </button>
          )}

          {isPaused && (
            <button
              onClick={() => onPauseResumeDecrypt(drive)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Lanjutkan Dekripsi</span>
            </button>
          )}

          {isOff && (
            <button
              onClick={() => onToggleEncrypt(drive)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1a2538] hover:bg-[#22314a] border border-[#2b3d5b] text-blue-300 hover:text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Aktifkan BitLocker</span>
            </button>
          )}

          <button
            onClick={() => onSelect(drive.id)}
            className="px-2.5 py-1.5 bg-[#172133] hover:bg-[#202d44] border border-[#273752] text-slate-300 text-xs rounded-lg transition-colors"
            title="Lihat Detail & Perintah manage-bde"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
