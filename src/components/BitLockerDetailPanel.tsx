import React, { useState } from 'react';
import { 
  DriveItem, 
  KeyProtector 
} from '../types/bitlocker';
import { formatBytes } from '../services/commandSimulator';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldOff, 
  KeyRound, 
  Lock, 
  Unlock, 
  Terminal, 
  Copy, 
  Check, 
  HardDrive, 
  Cpu, 
  Usb, 
  AlertTriangle,
  RotateCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface BitLockerDetailPanelProps {
  drive: DriveItem | null;
  onClose: () => void;
  onOpenUnlock: (drive: DriveItem) => void;
  onOpenDecrypt: (drive: DriveItem) => void;
  onPauseResumeDecrypt: (drive: DriveItem) => void;
  onRunCommand: (command: string) => void;
  onLockDrive?: (drive: DriveItem) => void;
}

export const BitLockerDetailPanel: React.FC<BitLockerDetailPanelProps> = ({
  drive,
  onClose,
  onOpenUnlock,
  onOpenDecrypt,
  onPauseResumeDecrypt,
  onRunCommand,
  onLockDrive
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFullKeys, setShowFullKeys] = useState(false);

  if (!drive) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#0d111a] border-l border-[#1b2234]">
        <HardDrive className="w-12 h-12 text-slate-700 mb-3" />
        <h3 className="text-sm font-semibold text-slate-400">Pilih Volume Drive</h3>
        <p className="text-xs text-slate-600 max-w-xs mt-1">
          Pilih salah satu drive dari daftar untuk melihat detail konfigurasi BitLocker, key protectors, dan perintah resmi.
        </p>
      </div>
    );
  }

  const isLocked = drive.lockStatus === 'Locked';
  const isDecrypting = drive.bitlockerStatus === 'Sedang Dekripsi';
  const isPaused = drive.bitlockerStatus === 'Dekripsi Dijeda';
  const isEncrypted = drive.protectionStatus === 'Protection On';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0d111a] border-l border-[#1b2234] select-none overflow-hidden">
      {/* Panel Top Header */}
      <div className="p-4 border-b border-[#1b2234] flex items-center justify-between bg-[#0a0d15]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
            {drive.letter}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{drive.volumeLabel}</span>
              {drive.isSystemDrive && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                  SYSTEM
                </span>
              )}
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>{drive.deviceType}</span>
              <span aria-hidden="true">·</span>
              <span>{drive.fileSystem}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#161d2d] transition-colors"
          title="Tutup Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Hardware & Drive Identity */}
        <div className="p-3.5 rounded-xl bg-[#121724] border border-[#1d263b] space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Identitas Perangkat Keras
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Model Drive:</span>
              <span className="text-slate-200 font-medium truncate block" title={drive.modelName}>
                {drive.modelName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Serial Number:</span>
              <span className="text-slate-200 font-mono text-[11px]">
                {drive.serialNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Kapasitas Total:</span>
              <span className="text-slate-200 font-mono font-medium">
                {formatBytes(drive.totalSizeBytes)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Kapasitas Terpakai:</span>
              <span className="text-slate-200 font-mono font-medium">
                {formatBytes(drive.usedSizeBytes)} ({Math.round((drive.usedSizeBytes / drive.totalSizeBytes) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* BitLocker Official Status Overview */}
        <div className="p-3.5 rounded-xl bg-[#121724] border border-[#1d263b] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Status BitLocker (manage-bde)
            </span>
            <button
              onClick={() => onRunCommand(`manage-bde -status ${drive.letter}`)}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Terminal className="w-3 h-3" />
              <span>Cek Status</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-[#1c2438]">
              <span className="text-slate-400">Status Proteksi:</span>
              <span className={`font-semibold ${
                drive.protectionStatus === 'Protection On' ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {drive.protectionStatus}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#1c2438]">
              <span className="text-slate-400">Lock Status:</span>
              <span className={`font-semibold ${
                drive.lockStatus === 'Locked' ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {drive.lockStatus}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#1c2438]">
              <span className="text-slate-400">Conversion Status:</span>
              <span className="text-slate-200 font-mono">
                {drive.conversionStatus}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#1c2438]">
              <span className="text-slate-400">Metode Enkripsi:</span>
              <span className="text-slate-200 font-mono font-medium">
                {drive.encryptionMethod}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Versi BitLocker:</span>
              <span className="text-slate-300 font-mono">2.0 (Windows 10/11)</span>
            </div>
          </div>
        </div>

        {/* Decryption Status & Control if Decrypting */}
        {(isDecrypting || isPaused) && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Dekripsi Sedang Berjalan
              </span>
              <span className="text-xs font-mono font-bold text-amber-200">
                {drive.decryptionPercent}%
              </span>
            </div>

            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              Peringatan: Jangan mencabut drive {drive.letter} sampai proses dekripsi mencapai 100%.
            </p>

            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${drive.decryptionPercent}%` }}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onPauseResumeDecrypt(drive)}
                className="flex-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {isPaused ? 'Lanjutkan Dekripsi (manage-bde -resume)' : 'Jeda Dekripsi (manage-bde -pause)'}
              </button>
            </div>
          </div>
        )}

        {/* Key Protectors List */}
        <div className="p-3.5 rounded-xl bg-[#121724] border border-[#1d263b] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Pelindung Kunci (Key Protectors: {drive.protectors.length})
            </span>
            {drive.validRecoveryKey && (
              <button
                onClick={() => setShowFullKeys(!showFullKeys)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                {showFullKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showFullKeys ? 'Masking' : 'Lihat Kunci'}</span>
              </button>
            )}
          </div>

          {drive.protectors.length > 0 ? (
            <div className="space-y-2">
              {drive.protectors.map((protector) => (
                <div 
                  key={protector.id}
                  className="p-2.5 rounded-lg bg-[#0b0f19] border border-[#1b2336] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                      {protector.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {protector.createdDate}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {protector.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-[#070910] px-2 py-1 rounded border border-[#171e2e]">
                    <span className="truncate pr-2">ID: {protector.id}</span>
                    <button
                      onClick={() => copyToClipboard(protector.id, protector.id)}
                      className="text-slate-400 hover:text-slate-200 shrink-0"
                      title="Salin ID Protector"
                    >
                      {copiedId === protector.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Recovery key display if available */}
                  {protector.type === 'Recovery Password' && drive.validRecoveryKey && (
                    <div className="mt-1.5 p-2 rounded bg-amber-950/20 border border-amber-500/20 text-[11px]">
                      <div className="flex items-center justify-between text-amber-300 mb-1">
                        <span className="font-semibold">Kunci Pemulihan 48-Digit:</span>
                        <button
                          onClick={() => copyToClipboard(drive.validRecoveryKey || '', 'rec-key')}
                          className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-200"
                        >
                          {copiedId === 'rec-key' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin Kunci</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="font-mono text-slate-300 tracking-wider break-all select-all">
                        {showFullKeys ? drive.validRecoveryKey : protector.recoveryPasswordPreview || '******-******-******-******-******-******-******-******'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2">
              Tidak ada key protector terkonfigurasi (BitLocker Nonaktif).
            </p>
          )}
        </div>

        {/* Administrator Action Buttons */}
        <div className="p-3.5 rounded-xl bg-[#121724] border border-[#1d263b] space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Tindakan Administrator
          </div>

          <div className="space-y-2">
            {isLocked && (
              <button
                onClick={() => onOpenUnlock(drive)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <Unlock className="w-4 h-4" />
                <span>Buka Kunci (Unlock Drive)</span>
              </button>
            )}

            {isEncrypted && (
              <button
                onClick={() => onOpenDecrypt(drive)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold rounded-lg transition-colors"
              >
                <ShieldOff className="w-4 h-4" />
                <span>Menonaktifkan BitLocker (Dekripsi)</span>
              </button>
            )}

            {!isLocked && drive.isRemovable && onLockDrive && (
              <button
                onClick={() => onLockDrive(drive)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#1a2336] hover:bg-[#23304a] text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-[#273654]"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Kunci Ulang Drive (manage-bde -lock)</span>
              </button>
            )}

            <button
              onClick={() => onRunCommand(`manage-bde -status ${drive.letter}`)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#161d2d] hover:bg-[#1f283d] text-slate-300 text-xs font-medium rounded-lg transition-colors border border-[#222c42]"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Jalankan manage-bde -status {drive.letter}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
