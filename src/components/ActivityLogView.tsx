import React, { useState } from 'react';
import { ActivityLog } from '../types/bitlocker';
import { 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Terminal, 
  Info,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface ActivityLogViewProps {
  logs: ActivityLog[];
  onClearLogs: () => void;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({
  logs,
  onClearLogs
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.driveLetter.toLowerCase().includes(q) ||
        (log.commandExecuted && log.commandExecuted.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportTxt = () => {
    let content = `========================================================================\n`;
    content += `        BITLOCKER ADMINISTRATOR PRO - AUDIT LOG AKTIVITAS SISTEM        \n`;
    content += `========================================================================\n`;
    content += `Waktu Cetak    : ${new Date().toLocaleString('id-ID')}\n`;
    content += `Platform       : Windows 10/11 Desktop Security Subsystem\n`;
    content += `Total Rekaman  : ${logs.length} catatan aktivitas\n`;
    content += `Privilege      : Elevated Local Administrator\n`;
    content += `Kebijakan Keamanan: Kredensial password dan recovery key disaring.\n`;
    content += `========================================================================\n\n`;

    for (const item of logs) {
      content += `[${item.timestamp}] [${item.level.padEnd(7, ' ')}] [Drive ${item.driveLetter.padEnd(3, ' ')}]\n`;
      content += `  Tindakan : ${item.action}\n`;
      content += `  Rincian  : ${item.details}\n`;
      if (item.commandExecuted) {
        content += `  Perintah : ${item.commandExecuted}\n`;
      }
      content += `------------------------------------------------------------------------\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BitLockerAdminPro-AuditLog-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLevelBadge = (level: ActivityLog['level']) => {
    switch (level) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" />
            <span>SUCCESS</span>
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/50 border border-rose-500/30 px-2 py-0.5 rounded">
            <AlertCircle className="w-3 h-3" />
            <span>ERROR</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" />
            <span>WARNING</span>
          </span>
        );
      case 'COMMAND':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">
            <Terminal className="w-3 h-3" />
            <span>CMD</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-900 border border-slate-700/50 px-2 py-0.5 rounded">
            <Info className="w-3 h-3" />
            <span>INFO</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* Header with Export & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#111622] border border-[#1e273a]">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Riwayat Aktivitas & Audit Keamanan Administrator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mencatat setiap tindakan manajemen BitLocker, pembukaan kunci, dekripsi, dan pemindaian sistem secara kronologis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTxt}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log ke TXT</span>
          </button>

          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172133] hover:bg-[#202d44] border border-[#273752] text-xs font-semibold text-slate-300 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Bersihkan Log</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111622] border border-[#1e273a] rounded-xl text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">Filter Tingkat:</span>
          {['ALL', 'SUCCESS', 'COMMAND', 'WARNING', 'ERROR'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterLevel === lvl
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#182133]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari log atau drive..."
            className="w-full bg-[#182030] border border-[#232f48] rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Log Entries Table */}
      <div className="rounded-2xl bg-[#0f131c] border border-[#1b2234] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141926] text-slate-400 font-semibold border-b border-[#1f283c]">
              <tr>
                <th className="py-2.5 px-4 w-36">Waktu</th>
                <th className="py-2.5 px-3 w-28">Status</th>
                <th className="py-2.5 px-3 w-20">Drive</th>
                <th className="py-2.5 px-4">Tindakan & Rincian</th>
                <th className="py-2.5 px-4">Perintah Eksekusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182033]">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(item => (
                  <tr key={item.id} className="hover:bg-[#141a27] transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getLevelBadge(item.level)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                      {item.driveLetter}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{item.action}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.details}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-cyan-300/90 whitespace-nowrap">
                      {item.commandExecuted ? (
                        <span className="px-2 py-0.5 bg-[#0a0d14] rounded border border-[#192133]">
                          {item.commandExecuted}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Tidak ada catatan aktivitas yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
