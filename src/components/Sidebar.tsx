import React from 'react';
import { 
  HardDrive, 
  Unlock, 
  Terminal, 
  FileText, 
  Code2, 
  HelpCircle, 
  ShieldAlert, 
  Activity,
  Layers,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';
import { ActiveTab, DriveItem } from '../types/bitlocker';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  drives: DriveItem[];
  selectedDriveId: string | null;
  onSelectDrive: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  drives,
  selectedDriveId,
  onSelectDrive
}) => {
  const decryptingCount = drives.filter(d => d.bitlockerStatus === 'Sedang Dekripsi').length;
  const lockedCount = drives.filter(d => d.lockStatus === 'Locked').length;

  return (
    <aside className="w-64 bg-[#0d111a] border-r border-[#1b2234] flex flex-col justify-between shrink-0 select-none">
      {/* Primary Navigation Tabs */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
          Menu Utama
        </div>

        <button
          onClick={() => onSelectTab('drives')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'drives'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-[#161d2d] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4" />
            <span>Manajemen Drive</span>
          </div>
          <span className="text-[11px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
            {drives.length}
          </span>
        </button>

        <button
          onClick={() => onSelectTab('decryption')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'decryption'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-[#161d2d] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Proses Dekripsi</span>
          </div>
          {decryptingCount > 0 && (
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold animate-pulse">
              {decryptingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('terminal')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'terminal'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-[#161d2d] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>PowerShell & CLI</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">manage-bde</span>
        </button>

        <button
          onClick={() => onSelectTab('logs')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-[#161d2d] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Log Aktivitas</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('source_code')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'source_code'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-[#161d2d] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>Source Code .NET 8</span>
          </div>
          <span className="text-[10px] font-mono px-1 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
            WPF
          </span>
        </button>

        <button
          onClick={() => onSelectTab('help')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'help'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-[#161d2d] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Panduan & Perintah</span>
          </div>
        </button>

        {/* Quick Drive Tree Picker */}
        <div className="pt-4">
          <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            <span>Daftar Volume ({drives.length})</span>
            {lockedCount > 0 && (
              <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> {lockedCount} Terkunci
              </span>
            )}
          </div>
          <div className="space-y-1 mt-1 max-h-56 overflow-y-auto pr-1">
            {drives.map((d) => {
              const isSelected = selectedDriveId === d.id;
              const isLocked = d.lockStatus === 'Locked';
              const isDecrypting = d.bitlockerStatus === 'Sedang Dekripsi';

              return (
                <button
                  key={d.id}
                  onClick={() => {
                    onSelectDrive(d.id);
                    if (activeTab !== 'drives') onSelectTab('drives');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-[#1e293b] text-white border-l-2 border-blue-500 font-medium'
                      : 'text-slate-400 hover:bg-[#131926] hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-bold text-slate-300 shrink-0">
                      {d.letter}
                    </span>
                    <span className="truncate text-[11px]" title={d.volumeLabel}>
                      {d.volumeLabel}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    {isLocked && <Lock className="w-3 h-3 text-rose-400" />}
                    {isDecrypting && <Activity className="w-3 h-3 text-amber-400 animate-spin" />}
                    {!isLocked && d.protectionStatus === 'Protection On' && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Direct Windows ZIP Download Action Card */}
      <div className="p-3 border-t border-[#1b2234] bg-[#0c101a]">
        <a
          href="/BitLockerAdministratorPro-Windows.zip"
          download="BitLockerAdministratorPro-Windows.zip"
          className="flex items-center justify-between p-2.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 text-purple-200 transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                Download ZIP Windows
              </div>
              <div className="text-[10px] text-slate-400">
                Installer .BAT + Source WPF
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/30">
            ZIP
          </span>
        </a>
      </div>

      {/* System Status Footprint */}
      <div className="p-3 border-t border-[#1b2234] bg-[#090c14]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
          <div className="text-[11px] leading-tight">
            <div className="font-semibold text-slate-300">Windows System Security</div>
            <div className="text-slate-500 text-[10px] font-mono">
              BitLocker WMI / manage-bde Ready
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
