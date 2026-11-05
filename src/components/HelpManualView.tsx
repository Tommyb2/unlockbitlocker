import React from 'react';
import { 
  HelpCircle, 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  KeyRound, 
  AlertTriangle, 
  Copy, 
  FileText,
  Lock,
  Unlock,
  ShieldCheck
} from 'lucide-react';

export const HelpManualView: React.FC = () => {
  const commands = [
    {
      title: 'Melihat Seluruh Status BitLocker Komputer',
      cmd: 'manage-bde -status',
      desc: 'Menampilkan ringkasan status enkripsi, persentase terenkripsi, proteksi, dan metode enkripsi untuk setiap volume yang terdeteksi.'
    },
    {
      title: 'Melihat Status BitLocker Drive Tertentu',
      cmd: 'manage-bde -status E:',
      desc: 'Menampilkan detail teknis spesifik drive E: termasuk daftar Key Protectors (Password, Recovery Password, TPM).'
    },
    {
      title: 'Membuka Kunci Menggunakan Password Pengguna',
      cmd: 'manage-bde -unlock E: -Password',
      desc: 'Membuka proteksi kunci sementara pada volume terenkripsi menggunakan sandi yang dibuat oleh pemilik drive.'
    },
    {
      title: 'Membuka Kunci Menggunakan 48-Digit Recovery Key',
      cmd: 'manage-bde -unlock E: -RecoveryPassword 459281-204918-384910-672019-194820-582019-301948-284019',
      desc: 'Membuka kunci darurat jika pengguna lupa password. Kunci berupa 48 digit angka dalam 8 blok.'
    },
    {
      title: 'Menonaktifkan BitLocker dan Memulai Dekripsi Resmi',
      cmd: 'manage-bde -off E:',
      desc: 'Menghapus enkripsi secara permanen melalui proses dekripsi latar belakang Windows. Volume harus terbuka kuncinya terlebih dahulu.'
    },
    {
      title: 'Menjeda Proses Dekripsi atau Enkripsi',
      cmd: 'manage-bde -pause E:',
      desc: 'Menghentikan sementara aktivitas I/O dekripsi volume jika komputer membutuhkan kinerja disk tinggi.'
    },
    {
      title: 'Melanjutkan Kembali Proses Dekripsi yang Dijeda',
      cmd: 'manage-bde -resume E:',
      desc: 'Melanjutkan kembali proses dekripsi BitLocker dari persentase terakhir.'
    },
    {
      title: 'Mengunci Kembali Drive USB / Removable Disk',
      cmd: 'manage-bde -lock E:',
      desc: 'Segera mengunci kembali drive eksternal yang sebelumnya dibuka sehingga data tidak dapat dibaca tanpa sandi lagi.'
    }
  ];

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#111622] border border-[#1e273a] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <span>Panduan & Perintah Resmi BitLocker Windows</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dokumentasi sintaks resmi utilitas <code className="text-cyan-400 font-mono">manage-bde.exe</code> dan protokol keamanan administrator.
          </p>
        </div>
      </div>

      {/* Security Principles (Aturan Keamanan Wajib) */}
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Prinsip Keamanan & Integritas Data Administrator</span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300">
          <li className="flex items-start gap-2 bg-[#0e121b] p-3 rounded-xl border border-[#1d2433]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Anti Kehilangan Data:</strong> Aplikasi tidak pernah memformat atau menghapus data file pengguna.</span>
          </li>
          <li className="flex items-start gap-2 bg-[#0e121b] p-3 rounded-xl border border-[#1d2433]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Kredensial Sah:</strong> Tidak melakukan bypass atau brute-force; hanya menerima sandi sah atau 48-digit Recovery Key.</span>
          </li>
          <li className="flex items-start gap-2 bg-[#0e121b] p-3 rounded-xl border border-[#1d2433]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Konfirmasi Wajib:</strong> Wajib meminta konfirmasi pengguna sebelum memulai proses dekripsi volume.</span>
          </li>
          <li className="flex items-start gap-2 bg-[#0e121b] p-3 rounded-xl border border-[#1d2433]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Privasi Kredensial:</strong> Password dan Recovery Key tidak pernah dicatat atau disimpan pada berkas log.</span>
          </li>
        </ul>
      </div>

      {/* Official Commands Reference Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Katalog Perintah Resmi Windows (manage-bde.exe)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commands.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#111622] border border-[#1f283d] space-y-2.5"
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>{c.title}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090b10] border border-[#171d2b] flex items-center justify-between font-mono text-xs text-yellow-300">
                <code className="truncate pr-2">{c.cmd}</code>
                <button
                  onClick={() => copyCommand(c.cmd)}
                  className="text-slate-500 hover:text-slate-200 shrink-0"
                  title="Salin Perintah"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
