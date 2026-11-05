import React, { useState } from 'react';
import { DriveItem } from '../types/bitlocker';
import { 
  X, 
  AlertTriangle, 
  ShieldOff, 
  CheckSquare, 
  Square, 
  Terminal, 
  HardDrive,
  Info
} from 'lucide-react';
import { formatBytes } from '../services/commandSimulator';

interface DecryptConfirmModalProps {
  drive: DriveItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDecrypt: (driveLetter: string) => void;
}

export const DecryptConfirmModal: React.FC<DecryptConfirmModalProps> = ({
  drive,
  isOpen,
  onClose,
  onConfirmDecrypt
}) => {
  const [understoodSafety, setUnderstoodSafety] = useState(false);
  const [understoodKeepPlugged, setUnderstoodKeepPlugged] = useState(false);

  if (!isOpen || !drive) return null;

  const canProceed = understoodSafety && understoodKeepPlugged;

  const handleStart = () => {
    if (!canProceed) return;
    onConfirmDecrypt(drive.letter);
    setUnderstoodSafety(false);
    setUnderstoodKeepPlugged(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0e131f] border border-[#2b1f24] rounded-2xl shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Danger Warning */}
        <div className="p-4 bg-rose-950/40 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Konfirmasi Dekripsi BitLocker: {drive.letter}
              </h3>
              <p className="text-xs text-rose-300">
                Menonaktifkan Proteksi Enkripsi Windows
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#182133] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Target Drive Summary Card */}
          <div className="p-3.5 rounded-xl bg-[#121724] border border-[#1d263b] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-slate-400" />
              <div>
                <span className="font-bold text-white text-sm block">
                  {drive.letter} [{drive.volumeLabel}]
                </span>
                <span className="text-slate-400">
                  {drive.deviceType} · {formatBytes(drive.usedSizeBytes)} data terpakai
                </span>
              </div>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-400">
              Metode: {drive.encryptionMethod}
            </div>
          </div>

          {/* Critical Warning Statement */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-2 leading-relaxed">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>PERINGATAN SISTEM WINDOWS</span>
            </div>
            <p>
              Proses dekripsi akan menghapus enkripsi pada seluruh sektor volume {drive.letter}. Selama proses ini, Windows akan membaca dan menulis kembali data dalam bentuk unencrypted.
            </p>
            <p className="font-semibold text-rose-300">
              ⚠️ JANGAN MENCABUT ATAU MEMATIKAN PERANGKAT PENYIMPANAN INI sebelum proses dekripsi mencapai 100%! Mencabut drive di tengah jalan dapat merusak tabel partisi atau master file table (MFT).
            </p>
          </div>

          {/* Mandatory Checkboxes */}
          <div className="space-y-2.5 pt-1">
            <label 
              onClick={() => setUnderstoodKeepPlugged(!understoodKeepPlugged)}
              className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none hover:text-white"
            >
              <div className="mt-0.5 text-blue-400 shrink-0">
                {understoodKeepPlugged ? (
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <span>
                Saya memastikan perangkat <strong>{drive.letter}</strong> akan tetap terhubung ke port komputer tanpa gangguan daya sampai dekripsi selesai.
              </span>
            </label>

            <label 
              onClick={() => setUnderstoodSafety(!understoodSafety)}
              className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none hover:text-white"
            >
              <div className="mt-0.5 text-blue-400 shrink-0">
                {understoodSafety ? (
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <span>
                Saya memiliki hak administrator untuk mematikan enkripsi dan memahami bahwa data tidak lagi diproteksi oleh BitLocker setelah selesai.
              </span>
            </label>
          </div>

          {/* Official command banner */}
          <div className="p-2.5 rounded-lg bg-[#080b12] border border-[#1a2336] flex items-center gap-2 text-[11px] font-mono text-cyan-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Perintah Windows: manage-bde -off {drive.letter}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1b253b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#161d2d] hover:bg-[#1e273d] transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleStart}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                canProceed
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-rose-950/40 text-slate-500 border border-rose-900/30 cursor-not-allowed'
              }`}
            >
              <ShieldOff className="w-3.5 h-3.5" />
              <span>Mulai Dekripsi (manage-bde -off)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
