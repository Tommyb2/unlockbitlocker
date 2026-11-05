import React, { useState } from 'react';
import { WPF_PROJECT_FILES, WpfFile } from '../data/wpfProjectFiles';
import JSZip from 'jszip';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  FolderTree, 
  ExternalLink,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const WpfSourceCodeView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<WpfFile>(WPF_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add all project files into the ZIP structure
      for (const file of WPF_PROJECT_FILES) {
        zip.file(file.path, file.content);
      }

      // Generate the zip blob
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'BitLockerAdministratorPro-WPF-DotNet8.zip';
      link.click();
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner & 1-Click ZIP Exporter */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#111622] border border-[#1e273a]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" />
              <span>Source Code Lengkap C# .NET 8 WPF Desktop</span>
            </h2>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
              WINDOWS 10 / 11 NATIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Solusi proyek lengkap Visual Studio / .NET CLI dengan integrasi <code className="text-cyan-400 font-mono">manage-bde.exe</code> dan hak akses Administrator UAC.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-950/50 transition-all disabled:opacity-60"
          >
            {zipSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>ZIP Berhasil Diunduh!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isZipping ? 'Menyiapkan ZIP...' : 'Download Project ZIP (.NET 8 WPF)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Code Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[650px]">
        {/* Left Tree Explorer */}
        <div className="lg:col-span-1 rounded-2xl bg-[#0e121a] border border-[#1b2234] p-3 flex flex-col justify-between overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
              <FolderTree className="w-3.5 h-3.5 text-purple-400" />
              <span>Struktur Folder Proyek</span>
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {WPF_PROJECT_FILES.map(file => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-colors text-left ${
                      isSelected
                        ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 font-semibold'
                        : 'text-slate-400 hover:bg-[#161d2d] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {file.category.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#090b10] border border-[#171d2b] text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Runtime:</span>
            </div>
            <p className="text-[10px] text-slate-400">
              net8.0-windows10.0.19041.0 (x64) dengan UAC Elevation requireAdministrator.
            </p>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-3 rounded-2xl bg-[#090b10] border border-[#1b2234] flex flex-col overflow-hidden shadow-2xl">
          {/* File bar */}
          <div className="px-4 py-2.5 bg-[#0e121a] border-b border-[#1b2234] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">{selectedFile.path}</span>
              <span className="text-slate-600">·</span>
              <span className="text-purple-400 font-semibold">{selectedFile.language.toUpperCase()}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#161d2b] hover:bg-[#202b3d] text-xs font-semibold text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          {/* Code text area with line numbers */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-200 bg-[#07090e] selection:bg-purple-900 selection:text-white">
            <pre className="whitespace-pre-wrap leading-relaxed">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Quick Compilation One-Liner Box */}
      <div className="p-4 rounded-2xl bg-[#111622] border border-[#1e273a] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Perintah Build Standalone .EXE (Direct CLI)</span>
        </div>
        <p className="text-xs text-slate-400">
          Jalankan perintah ini di Command Prompt / PowerShell setelah mengekstrak file ZIP untuk menghasilkan file <code className="text-white font-mono font-bold">BitLockerAdminPro.exe</code> yang langsung dapat dijalankan:
        </p>
        <div className="p-3 rounded-xl bg-[#090b10] border border-[#1b2234] font-mono text-xs text-yellow-300 flex items-center justify-between">
          <code className="select-all">
            dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ./publish
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText('dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ./publish');
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-slate-400 hover:text-white ml-2 shrink-0"
            title="Salin Perintah Build"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
