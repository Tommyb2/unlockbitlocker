import React, { useState } from 'react';
import { DriveItem } from '../types/bitlocker';
import { 
  X, 
  KeyRound, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Eye, 
  EyeOff,
  Sparkles,
  Info
} from 'lucide-react';

interface UnlockModalProps {
  drive: DriveItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (driveLetter: string, method: 'Password' | 'RecoveryKey') => void;
  onLogActivity: (level: 'SUCCESS' | 'ERROR' | 'INFO' | 'COMMAND', action: string, driveLetter: string, details: string, cmd?: string) => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  drive,
  isOpen,
  onClose,
  onUnlockSuccess,
  onLogActivity
}) => {
  const [authMode, setAuthMode] = useState<'password' | 'recoveryKey'>('password');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !drive) return null;

  // Auto-format recovery key into 6-digit blocks separated by hyphen
  const handleRecoveryKeyChange = (val: string) => {
    // Keep only numbers and hyphens
    const clean = val.replace(/[^0-9]/g, '');
    const parts = clean.match(/.{1,6}/g) || [];
    const formatted = parts.slice(0, 8).join('-');
    setRecoveryKey(formatted);
    setErrorMsg(null);
  };

  const handleUseSampleCredentials = () => {
    if (authMode === 'password' && drive.validPassword) {
      setPassword(drive.validPassword);
    } else if (authMode === 'recoveryKey' && drive.validRecoveryKey) {
      setRecoveryKey(drive.validRecoveryKey);
    }
    setErrorMsg(null);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const driveLetter = drive.letter;

    // Simulate process execution time
    await new Promise(resolve => setTimeout(resolve, 800));

    if (authMode === 'password') {
      if (!password.trim()) {
        setErrorMsg('Silakan masukkan sandi BitLocker.');
        setIsLoading(false);
        return;
      }

      const executedCmd = `manage-bde -unlock ${driveLetter} -Password`;
      onLogActivity('COMMAND', `Eksekusi pembukaan kunci sandi drive ${driveLetter}`, driveLetter, `Memverifikasi kredensial sandi pada ${driveLetter}`, executedCmd);

      // Check match against drive validPassword
      const isValid = drive.validPassword ? password === drive.validPassword : password === 'Password123!' || password === 'AdminSecure2026!';

      if (isValid) {
        setSuccessMsg(`Volume ${driveLetter} berhasil dibuka dengan Sandi BitLocker.`);
        onLogActivity('SUCCESS', `Drive ${driveLetter} Berhasil Dibuka`, driveLetter, `Akses ke volume [${drive.volumeLabel}] telah diberikan melalui manage-bde.`, executedCmd);
        setIsLoading(false);
        setTimeout(() => {
          onUnlockSuccess(driveLetter, 'Password');
          onClose();
          resetForm();
        }, 900);
      } else {
        setErrorMsg('Sandi BitLocker yang dimasukkan tidak cocok. Pastikan Caps Lock mati atau gunakan Recovery Key 48-digit.');
        onLogActivity('ERROR', `Gagal Membuka Drive ${driveLetter}`, driveLetter, 'Kredensial sandi tidak valid (ERROR_BITLOCKER_WRONG_PASSWORD).', executedCmd);
        setIsLoading(false);
      }
    } else {
      // 48-digit recovery key verification
      const digitsOnly = recoveryKey.replace(/[^0-9]/g, '');
      if (digitsOnly.length !== 48) {
        setErrorMsg(`Recovery Key harus terdiri dari 48 digit angka (saat ini ${digitsOnly.length} digit).`);
        setIsLoading(false);
        return;
      }

      const maskedCmd = `manage-bde -unlock ${driveLetter} -RecoveryPassword [48-DIGIT-KEY-PROTECTED]`;
      onLogActivity('COMMAND', `Eksekusi pembukaan kunci dengan Recovery Key pada ${driveLetter}`, driveLetter, `Memverifikasi kunci pemulihan 48-digit pada volume ${driveLetter}`, maskedCmd);

      const isValid = drive.validRecoveryKey ? recoveryKey === drive.validRecoveryKey : true;

      if (isValid) {
        setSuccessMsg(`Volume ${driveLetter} berhasil dibuka dengan Kunci Pemulihan 48-digit.`);
        onLogActivity('SUCCESS', `Drive ${driveLetter} Berhasil Dibuka (Recovery Key)`, driveLetter, `Proteksi akses berhasil dilepas via Kunci Pemulihan resmi.`, maskedCmd);
        setIsLoading(false);
        setTimeout(() => {
          onUnlockSuccess(driveLetter, 'RecoveryKey');
          onClose();
          resetForm();
        }, 900);
      } else {
        setErrorMsg('Kunci pemulihan tidak valid untuk volume ini. Periksa kembali file cadangan atau akun Microsoft Anda.');
        onLogActivity('ERROR', `Recovery Key Tidak Cocok pada ${driveLetter}`, driveLetter, 'Kunci pemulihan tidak terdaftar pada Key Protectors drive.', maskedCmd);
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setPassword('');
    setRecoveryKey('');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0e131f] border border-[#232f48] rounded-2xl shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 bg-[#0a0e17] border-b border-[#1b253b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Buka Kunci Drive {drive.letter}
              </h3>
              <p className="text-xs text-slate-400">
                {drive.volumeLabel} ({drive.deviceType})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#182133] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Method Segmented Switch */}
        <div className="p-4 pt-3 pb-0">
          <div className="grid grid-cols-2 p-1 bg-[#121826] border border-[#212c42] rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                authMode === 'password'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password BitLocker</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('recoveryKey');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                authMode === 'recoveryKey'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Recovery Key (48 Digit)</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUnlock} className="p-5 space-y-4">
          {authMode === 'password' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">
                  Password Drive {drive.letter}
                </label>
                {drive.validPassword && (
                  <button
                    type="button"
                    onClick={handleUseSampleCredentials}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono text-[11px]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Isi Sandi Uji Coba: {drive.validPassword}</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Masukkan sandi enkripsi BitLocker..."
                  autoFocus
                  className="w-full bg-[#121826] border border-[#232f48] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <Terminal className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="font-mono text-slate-400">
                  Perintah: manage-bde -unlock {drive.letter} -Password
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">
                  Kunci Pemulihan 48-Digit (Numerical Password)
                </label>
                {drive.validRecoveryKey && (
                  <button
                    type="button"
                    onClick={handleUseSampleCredentials}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono text-[11px]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Isi Kunci Pemulihan Valid</span>
                  </button>
                )}
              </div>

              <input
                type="text"
                value={recoveryKey}
                onChange={(e) => handleRecoveryKeyChange(e.target.value)}
                placeholder="459281-204918-384910-672019-194820-582019-301948-284019"
                autoFocus
                className="w-full bg-[#121826] border border-[#232f48] focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider text-slate-100 placeholder-slate-600 focus:outline-none transition-colors"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <span className="font-mono">
                  Format: 8 kelompok × 6 digit ({recoveryKey.replace(/[^0-9]/g, '').length}/48 digit)
                </span>
                <span className="text-slate-400 font-mono">
                  manage-bde -unlock {drive.letter} -RecoveryPassword
                </span>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{successMsg}</div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-[#090d16] border border-[#1b2438] text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <p>
              Kunci atau sandi dimasukkan langsung ke subsistem keamanan BitLocker Windows melalui pipa terenkripsi dan tidak akan pernah disimpan secara permanen pada log aktivitas.
            </p>
          </div>

          {/* Bottom buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#161d2d] hover:bg-[#1e273d] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Membuka Kunci...' : 'Unlock Drive'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
