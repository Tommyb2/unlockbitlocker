import React from 'react';
import { DriveItem } from '../types/bitlocker';
import { formatBytes } from '../services/commandSimulator';
import { 
  Activity, 
  Pause, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  HardDrive, 
  ShieldOff, 
  ShieldCheck,
  Terminal,
  Clock
} from 'lucide-react';

interface DecryptionMonitorViewProps {
  drives: DriveItem[];
  onPauseResume: (drive: DriveItem) => void;
  onRefresh: () => void;
  onRunCommand: (command: string) => void;
  onOpenDecryptModal: (drive: DriveItem) => void;
  isRefreshing: boolean;
}

export const DecryptionMonitorView: React.FC<DecryptionMonitorViewProps> = ({
  drives,
  onPauseResume,
  onRefresh,
  onRunCommand,
  onOpenDecryptModal,
  isRefreshing
}) => {
  const decryptingDrives = drives.filter(
    d => d.bitlockerStatus === 'Sedang Dekripsi' || d.bitlockerStatus === 'Dekripsi Dijeda'
  );

  const eligibleForDecryption = drives.filter(
    d => d.protectionStatus === 'Protection On' && d.lockStatus === 'Unlocked'
  );

  return (
    <div className="space-y-6 select-none">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#111622] border border-[#1e273a]">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <span>Pusat Pemantauan Dekripsi BitLocker Real-Time</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Memantau proses dekripsi sektor per sektor via Windows background thread engine (<code className="text-cyan-400 font-mono">manage-bde -off</code>)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172133] hover:bg-[#202d44] border border-[#273752] text-xs font-semibold text-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      {/* Active Decryption Operations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Operasi Dekripsi Berjalan ({decryptingDrives.length})</span>
          <span className="text-[11px] text-amber-400 font-mono">
            Auto-Polling: Aktif (Interval 1s)
          </span>
        </div>

        {decryptingDrives.length > 0 ? (
          <div className="space-y-4">
            {decryptingDrives.map(drive => {
              const isPaused = drive.bitlockerStatus === 'Dekripsi Dijeda';
              const decryptedBytes = Math.round((drive.usedSizeBytes * drive.decryptionPercent) / 100);
              const remainingBytes = drive.usedSizeBytes - decryptedBytes;

              return (
                <div
                  key={drive.id}
                  className="p-5 rounded-2xl bg-[#121826] border border-[#232f48] shadow-lg space-y-4"
                >
                  {/* Top Bar of active item */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-base">
                        {drive.letter}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">
                            {drive.volumeLabel}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {drive.deviceType}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                            isPaused 
                              ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30' 
                              : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {isPaused ? 'Dijeda' : 'Sedang Mendekripsi'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Sistem Berkas: {drive.fileSystem}</span>
                          <span aria-hidden="true">·</span>
                          <span>Ukuran Data: {formatBytes(drive.usedSizeBytes)}</span>
                          <span aria-hidden="true">·</span>
                          <span>Algoritma: {drive.encryptionMethod}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress percentage display */}
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-amber-400">
                        {drive.decryptionPercent}%
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {formatBytes(decryptedBytes)} dari {formatBytes(drive.usedSizeBytes)}
                      </div>
                    </div>
                  </div>

                  {/* Primary Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-[#0a0d16] border border-[#1b253b] rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isPaused
                            ? 'bg-amber-600'
                            : 'bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        }`}
                        style={{ width: `${drive.decryptionPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>0% (Terenkripsi Penuh)</span>
                      <span>Sisa: ~{formatBytes(remainingBytes)}</span>
                      <span>100% (Decrypted)</span>
                    </div>
                  </div>

                  {/* Warning banner */}
                  <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">Penting: </span>
                      Pastikan perangkat penyimpanan <code className="font-mono text-amber-300 font-bold">{drive.letter}</code> tetap terhubung ke port USB/SATA tanpa diputus agar integritas tabel partisi tetap terjaga.
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1d273e]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPauseResume(drive)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                          isPaused
                            ? 'bg-emerald-600 hover:bg-emerald-500'
                            : 'bg-amber-600 hover:bg-amber-500'
                        }`}
                      >
                        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        <span>{isPaused ? 'Lanjutkan (manage-bde -resume)' : 'Jeda (manage-bde -pause)'}</span>
                      </button>

                      <button
                        onClick={() => onRunCommand(`manage-bde -status ${drive.letter}`)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#172133] hover:bg-[#202d44] border border-[#273752] text-xs font-semibold text-slate-300 rounded-xl transition-colors"
                      >
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Cek Status CLI</span>
                      </button>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Terakhir diperbarui: {drive.lastChecked}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl bg-[#111622] border border-[#1e273a] p-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/60 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">
              Tidak Ada Dekripsi yang Sedang Berjalan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Semua volume penyimpanan berada dalam status stabil (baik terproteksi penuh maupun tidak terenkripsi). Anda dapat memulai dekripsi pada drive yang terenkripsi dan telah terbuka kuncinya di bawah ini.
            </p>
          </div>
        )}
      </div>

      {/* Eligible Drives for Decryption */}
      {eligibleForDecryption.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Volume Terenkripsi yang Siap Didekripsi ({eligibleForDecryption.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {eligibleForDecryption.map(drive => (
              <div
                key={drive.id}
                className="p-4 rounded-xl bg-[#111622] border border-[#1f283d] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                    {drive.letter}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {drive.volumeLabel}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {drive.deviceType} · {formatBytes(drive.usedSizeBytes)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenDecryptModal(drive)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <ShieldOff className="w-3.5 h-3.5" />
                  <span>Matikan BitLocker</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
