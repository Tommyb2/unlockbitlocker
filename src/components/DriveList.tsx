import React, { useState } from 'react';
import { DriveItem } from '../types/bitlocker';
import { DriveCard } from './DriveCard';
import { 
  HardDrive, 
  ShieldCheck, 
  Lock, 
  Activity, 
  Filter, 
  ShieldOff,
  Usb,
  FolderOpen
} from 'lucide-react';

interface DriveListProps {
  drives: DriveItem[];
  selectedDriveId: string | null;
  onSelectDrive: (id: string) => void;
  onOpenUnlock: (drive: DriveItem) => void;
  onOpenDecrypt: (drive: DriveItem) => void;
  onPauseResumeDecrypt: (drive: DriveItem) => void;
  onToggleEncrypt: (drive: DriveItem) => void;
  searchQuery: string;
}

export const DriveList: React.FC<DriveListProps> = ({
  drives,
  selectedDriveId,
  onSelectDrive,
  onOpenUnlock,
  onOpenDecrypt,
  onPauseResumeDecrypt,
  onToggleEncrypt,
  searchQuery
}) => {
  const [filterType, setFilterType] = useState<'all' | 'removable' | 'internal' | 'locked' | 'decrypting'>('all');

  const filteredDrives = drives.filter(d => {
    // Search filter
    const matchesSearch = 
      d.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.volumeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.bitlockerStatus.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter
    if (filterType === 'removable') return d.isRemovable;
    if (filterType === 'internal') return !d.isRemovable;
    if (filterType === 'locked') return d.lockStatus === 'Locked';
    if (filterType === 'decrypting') return d.bitlockerStatus === 'Sedang Dekripsi' || d.bitlockerStatus === 'Dekripsi Dijeda';

    return true;
  });

  const totalCapacity = drives.reduce((acc, d) => acc + d.totalSizeBytes, 0);
  const lockedCount = drives.filter(d => d.lockStatus === 'Locked').length;
  const protectedCount = drives.filter(d => d.protectionStatus === 'Protection On').length;
  const decryptingCount = drives.filter(d => d.bitlockerStatus === 'Sedang Dekripsi').length;

  return (
    <div className="space-y-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#111622] border border-[#1e273a] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400">Total Drive</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{drives.length}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <HardDrive className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#111622] border border-[#1e273a] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400">Proteksi Aktif</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{protectedCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#111622] border border-[#1e273a] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400">Drive Terkunci</div>
            <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{lockedCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#111622] border border-[#1e273a] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400">Sedang Dekripsi</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{decryptingCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Segmented Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1 p-1 bg-[#121826] border border-[#1f283d] rounded-lg">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#182133]'
            }`}
          >
            Semua Drive ({drives.length})
          </button>
          <button
            onClick={() => setFilterType('removable')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterType === 'removable'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#182133]'
            }`}
          >
            USB & Eksternal ({drives.filter(d => d.isRemovable).length})
          </button>
          <button
            onClick={() => setFilterType('internal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterType === 'internal'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#182133]'
            }`}
          >
            Drive Internal ({drives.filter(d => !d.isRemovable).length})
          </button>
          <button
            onClick={() => setFilterType('locked')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterType === 'locked'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#182133]'
            }`}
          >
            Terkunci ({lockedCount})
          </button>
          <button
            onClick={() => setFilterType('decrypting')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterType === 'decrypting'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#182133]'
            }`}
          >
            Dekripsi ({decryptingCount})
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Menampilkan {filteredDrives.length} dari {drives.length} volume
        </div>
      </div>

      {/* Grid of Drive Cards */}
      {filteredDrives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDrives.map(drive => (
            <DriveCard
              key={drive.id}
              drive={drive}
              isSelected={selectedDriveId === drive.id}
              onSelect={onSelectDrive}
              onOpenUnlock={onOpenUnlock}
              onOpenDecrypt={onOpenDecrypt}
              onPauseResumeDecrypt={onPauseResumeDecrypt}
              onToggleEncrypt={onToggleEncrypt}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-[#10141f] border border-[#1d2538] p-8 space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">
            Tidak Ada Drive Ditemukan
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ada perangkat penyimpanan yang cocok dengan filter atau kata kunci pencarian.
          </p>
        </div>
      )}
    </div>
  );
};
