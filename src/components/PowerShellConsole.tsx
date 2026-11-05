import React, { useState, useRef, useEffect } from 'react';
import { DriveItem } from '../types/bitlocker';
import { 
  generateManageBdeStatusAll, 
  generateManageBdeStatusSingle, 
  generatePowerShellBitLockerVolume 
} from '../services/commandSimulator';
import { 
  Terminal, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  CornerDownLeft, 
  ShieldCheck, 
  HelpCircle,
  Command
} from 'lucide-react';

interface PowerShellConsoleProps {
  drives: DriveItem[];
  onExecuteCommand: (cmd: string) => void;
  initialCommand?: string;
}

interface ConsoleOutputLine {
  id: string;
  type: 'prompt' | 'stdout' | 'stderr' | 'info';
  content: string;
}

export const PowerShellConsole: React.FC<PowerShellConsoleProps> = ({
  drives,
  onExecuteCommand,
  initialCommand
}) => {
  const [commandInput, setCommandInput] = useState(initialCommand || '');
  const [history, setHistory] = useState<ConsoleOutputLine[]>([
    {
      id: 'init-1',
      type: 'info',
      content: 'Windows PowerShell [Administrator]\nCopyright (C) Microsoft Corporation. All rights reserved.\nInstalled Modules: BitLocker (manage-bde.exe v10.0.22631)\n'
    },
    {
      id: 'init-2',
      type: 'prompt',
      content: 'PS C:\\Windows\\system32> manage-bde -status'
    },
    {
      id: 'init-3',
      type: 'stdout',
      content: generateManageBdeStatusAll(drives)
    }
  ]);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (initialCommand) {
      handleRunCommand(initialCommand);
    }
  }, [initialCommand]);

  const handleRunCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    const newLines: ConsoleOutputLine[] = [
      {
        id: `p-${Date.now()}`,
        type: 'prompt',
        content: `PS C:\\Windows\\system32> ${cmd}`
      }
    ];

    const lower = cmd.toLowerCase();

    if (lower === 'cls' || lower === 'clear' || lower === 'clear-host') {
      setHistory([]);
      setCommandInput('');
      return;
    }

    if (lower === 'help' || lower === 'get-help' || lower === 'manage-bde /?') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'stdout',
        content: `Daftar Perintah Resmi BitLocker Windows:\n
  manage-bde -status             : Menampilkan status BitLocker untuk seluruh drive
  manage-bde -status <drive>     : Menampilkan detail status drive tertentu (misal: E:)
  manage-bde -unlock <drive> -pw : Membuka kunci dengan Password
  manage-bde -unlock <drive> -rp : Membuka kunci dengan 48-digit Recovery Password
  manage-bde -off <drive>        : Mematikan BitLocker & memulai dekripsi
  manage-bde -pause <drive>      : Menjeda proses dekripsi atau enkripsi
  manage-bde -resume <drive>     : Melanjutkan kembali proses dekripsi
  manage-bde -lock <drive>       : Mengunci kembali drive USB/removable
  Get-BitLockerVolume            : Cmdlet PowerShell untuk tabel status volume`
      });
    } else if (lower.startsWith('get-bitlockervolume')) {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'stdout',
        content: generatePowerShellBitLockerVolume(drives)
      });
    } else if (lower === 'manage-bde -status' || lower === 'manage-bde.exe -status') {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'stdout',
        content: generateManageBdeStatusAll(drives)
      });
    } else if (lower.startsWith('manage-bde -status ') || lower.startsWith('manage-bde.exe -status ')) {
      const parts = cmd.split(' ');
      const letter = (parts[2] || 'C:').toUpperCase();
      const matched = drives.find(d => d.letter.toUpperCase().startsWith(letter.substring(0, 1)));
      if (matched) {
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'stdout',
          content: generateManageBdeStatusSingle(matched)
        });
      } else {
        newLines.push({
          id: `err-${Date.now()}`,
          type: 'stderr',
          content: `ERROR: Volume ${letter} tidak ditemukan pada subsistem penyimpanan komputer.`
        });
      }
    } else if (lower.startsWith('manage-bde -off') || lower.startsWith('manage-bde.exe -off')) {
      const parts = cmd.split(' ');
      const letter = (parts[2] || 'E:').toUpperCase();
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'stdout',
        content: `BitLocker Drive Encryption: Configuration Tool version 10.0.22631\nCopyright (C) 2013 Microsoft Corporation. All rights reserved.\n\nDecryption is now in progress on volume ${letter}.\nConversion Status: Decryption in Progress\nProtection Status: Protection Off`
      });
      onExecuteCommand(cmd);
    } else if (lower.startsWith('manage-bde -pause') || lower.startsWith('manage-bde.exe -pause')) {
      const parts = cmd.split(' ');
      const letter = (parts[2] || 'E:').toUpperCase();
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'stdout',
        content: `Decryption paused successfully on volume ${letter}.`
      });
      onExecuteCommand(cmd);
    } else if (lower.startsWith('manage-bde -resume') || lower.startsWith('manage-bde.exe -resume')) {
      const parts = cmd.split(' ');
      const letter = (parts[2] || 'E:').toUpperCase();
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'stdout',
        content: `Decryption resumed successfully on volume ${letter}.`
      });
      onExecuteCommand(cmd);
    } else if (lower.startsWith('manage-bde -unlock')) {
      const parts = cmd.split(' ');
      const letter = (parts[2] || 'E:').toUpperCase();
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'stdout',
        content: `BitLocker Drive Encryption: Configuration Tool version 10.0.22631\nCopyright (C) 2013 Microsoft Corporation. All rights reserved.\n\nVolume ${letter} is successfully unlocked.`
      });
      onExecuteCommand(cmd);
    } else {
      newLines.push({
        id: `out-${Date.now()}`,
        type: 'stdout',
        content: `Perintah '${cmd}' berhasil dieksekusi dengan hak akses Windows Administrator (ExitCode: 0).`
      });
    }

    setHistory(prev => [...prev, ...newLines]);
    setCommandInput('');
  };

  const handleCopyConsole = () => {
    const text = history.map(h => h.content).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: 'manage-bde -status', cmd: 'manage-bde -status' },
    { label: 'Get-BitLockerVolume', cmd: 'Get-BitLockerVolume' },
    { label: 'manage-bde -status E:', cmd: 'manage-bde -status E:' },
    { label: 'manage-bde -off E:', cmd: 'manage-bde -off E:' },
    { label: 'manage-bde -pause E:', cmd: 'manage-bde -pause E:' },
    { label: 'manage-bde -resume E:', cmd: 'manage-bde -resume E:' },
    { label: 'Clear-Host', cmd: 'cls' },
    { label: 'help', cmd: 'help' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-2xl bg-[#090b10] border border-[#1b2234] shadow-2xl overflow-hidden select-none">
      {/* Terminal Title Bar */}
      <div className="px-4 py-2.5 bg-[#0e121a] border-b border-[#1b2234] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white">Administrator: Windows PowerShell</span>
          <span className="text-slate-500">·</span>
          <span className="text-blue-400">manage-bde CLI Engine</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyConsole}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161d2b] hover:bg-[#202b3d] text-xs text-slate-300 transition-colors"
            title="Salin seluruh log console"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Output'}</span>
          </button>

          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161d2b] hover:bg-[#202b3d] text-xs text-slate-300 transition-colors"
            title="Bersihkan konsol"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Bersihkan</span>
          </button>
        </div>
      </div>

      {/* Preset Command Strip */}
      <div className="px-4 py-2 bg-[#0b0e14] border-b border-[#171d2b] flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
          <Command className="w-3 h-3 text-cyan-400" />
          <span>Preset Resmi:</span>
        </span>
        {presets.map(p => (
          <button
            key={p.label}
            onClick={() => handleRunCommand(p.cmd)}
            className="px-2.5 py-1 rounded-md bg-[#131924] hover:bg-blue-600 hover:text-white border border-[#20293b] text-xs font-mono text-slate-300 transition-all shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Terminal Screen & History */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 text-slate-200">
        {history.map(item => {
          if (item.type === 'prompt') {
            return (
              <div key={item.id} className="text-yellow-400 font-semibold pt-1">
                {item.content}
              </div>
            );
          }
          if (item.type === 'stderr') {
            return (
              <div key={item.id} className="text-rose-400 whitespace-pre-wrap pl-2 border-l-2 border-rose-500/40">
                {item.content}
              </div>
            );
          }
          if (item.type === 'info') {
            return (
              <div key={item.id} className="text-cyan-400/80 whitespace-pre-wrap pb-1">
                {item.content}
              </div>
            );
          }
          return (
            <div key={item.id} className="text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
              {item.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Command Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunCommand(commandInput);
        }}
        className="p-3 bg-[#0c1017] border-t border-[#1b2234] flex items-center gap-2"
      >
        <span className="font-mono text-xs font-bold text-yellow-400 shrink-0">
          PS C:\Windows\system32&gt;
        </span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Ketik perintah resmi (misal: manage-bde -status E: atau help)..."
          className="flex-1 bg-transparent border-0 font-mono text-xs text-white placeholder-slate-600 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-colors"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          <span>Enter</span>
        </button>
      </form>
    </div>
  );
};
