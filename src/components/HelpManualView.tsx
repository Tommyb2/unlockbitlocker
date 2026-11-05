import React, { useState } from 'react';
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
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  HardDrive,
  Check,
  Info
} from 'lucide-react';

export const HelpManualView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'commands' | 'safety'>('architecture');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

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
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-[#111622] border border-[#1e273a] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <span>Dokumentasi & Cara Kerja BitLocker di Windows Sebenarnya</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Penjelasan teknis bagaimana aplikasi ini beroperasi di dalam Windows 10 & 11, interaksi Kernel Driver, dan hierarki keamanan.
          </p>
        </div>

        {/* Sub-tabs switch */}
        <div className="flex items-center gap-1 p-1 bg-[#090b10] border border-[#1a2336] rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'architecture'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Arsitektur Windows
          </button>
          <button
            onClick={() => setActiveSubTab('commands')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'commands'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Perintah manage-bde
          </button>
          <button
            onClick={() => setActiveSubTab('safety')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'safety'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Protokol Keamanan Data
          </button>
        </div>
      </div>

      {/* Tab 1: Architecture in Real Windows */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Layer Pipeline Diagram */}
          <div className="p-5 rounded-2xl bg-[#10141f] border border-[#1f283d] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Diagram Alur Kerja BitLocker Administrator Pro di Windows</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-[#090c14] border border-[#1b2336] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                    LAYER 1
                  </span>
                  <span className="text-xs text-slate-500 font-mono">User Space</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">Aplikasi WPF (.NET 8)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Berjalan dengan hak <strong>Administrator (UAC Elevated)</strong>. Menyediakan antarmuka grafis untuk memilih drive, memasukkan sandi, dan memantau status.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-[#090c14] border border-[#1b2336] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    LAYER 2
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Win32 Subsystem</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">manage-bde.exe / WMI</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Memanggil binary resmi Windows di <code className="text-cyan-400 font-mono">C:\Windows\System32\manage-bde.exe</code> melalui <code className="font-mono text-slate-300">ProcessStartInfo</code> dan pipa WMI <code className="font-mono text-slate-300">Win32_EncryptableVolume</code>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-[#090c14] border border-[#1b2336] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    LAYER 3
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Kernel Driver</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">fvevol.sys (Filter Driver)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Driver enkripsi volume bawaan kernel Windows. Mencegat semua request I/O disk. Saat drive terkunci, partisi disembunyikan dari File Explorer.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-xl bg-[#090c14] border border-[#1b2336] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    LAYER 4
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Physical Hardware</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">Perangkat Penyimpanan</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Flashdisk USB, SSD/HDD Eksternal, atau SSD NVMe Internal. Sektor fisik disk dienkripsi dengan standar <strong>XTS-AES 128/256-bit</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Deep Dives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Box 1: How Unlock Works */}
            <div className="p-4 rounded-xl bg-[#111622] border border-[#1e273a] space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Unlock className="w-4 h-4" />
                <span>Bagaimana Proses "Unlock Drive" Bekerja Sebenarnya?</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Di Windows, sektor disk dienkripsi dengan <strong>FVEK (Full Volume Encryption Key)</strong>. Kunci ini dilindungi oleh <strong>VMK (Volume Master Key)</strong>:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1 leading-relaxed">
                <li>Pengguna memasukkan <strong>Password</strong> atau <strong>48-digit Recovery Key</strong> ke aplikasi.</li>
                <li>Aplikasi mengalirkannya ke <code className="text-cyan-400 font-mono">manage-bde -unlock E: -Password</code> via <em>StandardInput</em> (agar aman dari Process Explorer).</li>
                <li>Windows memverifikasi kredensial terhadap metadata protektor BitLocker di awal partisi.</li>
                <li>Jika cocok, Windows mendekripsi VMK, lalu memuat FVEK langsung ke memori aman kernel (<code className="text-slate-300 font-mono">fvevol.sys</code>).</li>
                <li>Seketika itu juga, volume di-mount dan langsung dapat diakses normal melalui File Explorer tanpa perlu dekripsi seluruh isi disk.</li>
              </ol>
            </div>

            {/* Box 2: How Decrypt Works */}
            <div className="p-4 rounded-xl bg-[#111622] border border-[#1e273a] space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Bagaimana Proses "Disable / Dekripsi" Bekerja Sebenarnya?</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Ketika tombol <strong>Matikan BitLocker</strong> ditekan, aplikasi menjalankan <code className="text-cyan-400 font-mono">manage-bde -off E:</code>:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1 leading-relaxed">
                <li>Windows meluncurkan <strong>Kernel Background Worker Thread</strong> khusus untuk volume tersebut.</li>
                <li>Thread membaca blok sektor terenkripsi (*ciphertext*), men-dekripsinya menggunakan FVEK, lalu menulis kembali data (*plaintext*) ke sektor fisik yang sama.</li>
                <li>Proses ini berlangsung secara bertahap (0% hingga 100%) dan dapat dijeda (<code className="text-amber-400 font-mono">-pause</code>) atau dilanjutkan (<code className="text-emerald-400 font-mono">-resume</code>).</li>
                <li><strong>Mengapa dilarang mencabut drive?</strong> Karena tabel alokasi partisi dan metadata sedang ditulis ulang secara aktif. Mencabut drive saat proses ini dapat menyebabkan partisi menjadi <em>RAW</em> atau rusak.</li>
              </ol>
            </div>
          </div>

          {/* Practical Execution Guide on Real PC */}
          <div className="p-4 rounded-xl bg-[#0e131f] border border-[#1b253b] space-y-2.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Cara Menjalankan File Hasil Build di Komputer Windows Asli Anda</span>
            </h4>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                1. Klik tab <strong>Source Code .NET 8</strong> di sidebar kiri aplikasi ini, lalu tekan tombol <strong>Download Project ZIP (.NET 8 WPF)</strong>.
              </p>
              <p>
                2. Ekstrak file ZIP di komputer Windows 10 atau Windows 11 Anda.
              </p>
              <p>
                3. Buka folder hasil ekstrak, klik dua kali file <strong>build.bat</strong> (atau jalankan perintah <code className="text-yellow-300 font-mono bg-black/40 px-2 py-0.5 rounded">dotnet publish -c Release -r win-x64 --self-contained -p:PublishSingleFile=true -o ./publish</code> di Command Prompt).
              </p>
              <p>
                4. File executable mandiri <strong>BitLockerAdminPro.exe</strong> akan dibuat di folder <code className="text-slate-200 font-mono">publish\</code>. Klik kanan file tersebut lalu pilih <strong>Run as administrator</strong>!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Commands */}
      {activeSubTab === 'commands' && (
        <div className="space-y-3 animate-in fade-in duration-200">
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
                    {copiedCmd === c.cmd ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security & Data Loss Prevention */}
      {activeSubTab === 'safety' && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Prinsip Keamanan & Integritas Data Administrator</span>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2 bg-[#0e121b] p-3 rounded-xl border border-[#1d2433]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Anti Kehilangan Data:</strong> Aplikasi tidak pernah memformat atau menghapus data file pengguna. Semua operasi adalah enkripsi/dekripsi resmi in-place.</span>
            </li>
            <li className="flex items-start gap-2 bg-[#0e121b] p-3 rounded-xl border border-[#1d2433]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Kredensial Sah:</strong> Tidak melakukan bypass atau brute-force; hanya menerima sandi sah atau 48-digit Recovery Key yang terdaftar di volume.</span>
            </li>
            <li className="flex items-start gap-2 bg-[#0e121b] p-3 rounded-xl border border-[#1d2433]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Konfirmasi Wajib:</strong> Wajib meminta konfirmasi pengguna sebelum memulai proses dekripsi volume dengan peringatan agar disk tidak dilepas.</span>
            </li>
            <li className="flex items-start gap-2 bg-[#0e121b] p-3 rounded-xl border border-[#1d2433]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Privasi Kredensial:</strong> Password dan Recovery Key dialirkan melalui pipa proses StandardInput dan tidak pernah dicatat atau disimpan pada berkas log.</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
