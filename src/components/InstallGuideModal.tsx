import React from 'react';
import { 
  X, 
  Download, 
  Terminal, 
  FolderArchive, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Laptop,
  PlayCircle
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0e131f] border border-[#232f48] rounded-2xl shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#0a0e17] border-b border-[#1b253b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <FolderArchive className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Panduan Memasang & Menjalankan di Windows 10 & 11
              </h3>
              <p className="text-xs text-slate-400">
                Cara menjalankan BitLocker Administrator Pro dari file ZIP
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Direct Download Box */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-purple-200">
                File ZIP Siap Diunduh
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Nama Berkas: <code className="text-purple-300 font-mono">BitLockerAdministratorPro-Windows.zip</code> (~14 KB)
              </div>
            </div>

            <a
              href="/BitLockerAdministratorPro-Windows.zip"
              download="BitLockerAdministratorPro-Windows.zip"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-950/50 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download File ZIP Sekarang</span>
            </a>
          </div>

          {/* 3 Step Instructions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Langkah Cepat Memasang (Hanya 3 Langkah):
            </h4>

            <div className="space-y-3 text-xs">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-[#121826] border border-[#1f283d] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <div className="font-bold text-white">Ekstrak File ZIP di Komputer Anda</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Klik kanan file <code className="text-purple-300 font-mono">BitLockerAdministratorPro-Windows.zip</code> yang telah diunduh, lalu pilih <strong>Extract All... (Ekstrak Semua)</strong> ke folder mana saja (contoh: di Desktop atau C:\BitLockerAdminPro).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-[#121826] border border-[#1f283d] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <div className="font-bold text-white">Jalankan "Install-and-Run.bat"</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Masuk ke folder hasil ekstrak, klik kanan file <strong className="text-cyan-300">Install-and-Run.bat</strong>, lalu pilih <strong>"Run as administrator"</strong>. Script ini otomatis:
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 mt-1 space-y-0.5">
                    <li>Memverifikasi runtime .NET 8 (menyediakan link download otomatis jika belum terpasang).</li>
                    <li>Mengompilasi aplikasi menjadi executable standalone tunggal (<code className="text-white font-mono">BitLockerAdminPro.exe</code>).</li>
                    <li>Membuat Shortcut resmi di Desktop Windows Anda.</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-[#121826] border border-[#1f283d] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <div className="font-bold text-emerald-300">Aplikasi Siap Digunakan!</div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Aplikasi akan otomatis terbuka atau dapat Anda buka kapan saja melalui shortcut <strong>BitLocker Administrator Pro</strong> di Desktop dengan hak akses Administrator.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="p-3 rounded-xl bg-[#0a0d16] border border-[#1b253b] text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Semua perintah dan proses di dalam aplikasi menggunakan API resmi Windows (<code className="text-white font-mono">manage-bde.exe</code>), aman untuk integritas berkas dan tidak akan pernah merusak data penyimpanan Anda.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0e17] border-t border-[#1b253b] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1a2336] hover:bg-[#23304a] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
