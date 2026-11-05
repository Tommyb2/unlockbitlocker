import React, { useState } from 'react';
import { DriveItem, DeviceType, BitLockerStatus } from '../types/bitlocker';
import { 
  X, 
  Usb, 
  HardDrive, 
  Cpu, 
  Plus, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface NewDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDrive: (newDrive: DriveItem) => void;
  existingLetters: string[];
}

export const NewDeviceModal: React.FC<NewDeviceModalProps> = ({
  isOpen,
  onClose,
  onAddDrive,
  existingLetters
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('USB Flashdisk');
  const [volumeLabel, setVolumeLabel] = useState('SANDISK_ULTRA');
  const [capacityGB, setCapacityGB] = useState(64);
  const [bitlockerChoice, setBitlockerChoice] = useState<'locked' | 'unlocked' | 'off'>('locked');

  if (!isOpen) return null;

  // Determine next free letter
  const alphabet = 'HIJKLMNOPQRSTUVWXYZ'.split('');
  const freeLetter = alphabet.find(l => !existingLetters.includes(`${l}:`)) || 'Z';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    let blStatus: BitLockerStatus = 'Tidak Terenkripsi (Off)';
    let lockStatus: DriveItem['lockStatus'] = 'NotApplicable';
    let protStatus: DriveItem['protectionStatus'] = 'Protection Off';
    let method: DriveItem['encryptionMethod'] = 'None';
    let validPw: string | undefined = undefined;
    let validKey: string | undefined = undefined;

    if (bitlockerChoice === 'locked') {
      blStatus = 'Terenkripsi (Terkunci)';
      lockStatus = 'Locked';
      protStatus = 'Protection On';
      method = 'XTS-AES 128-bit';
      validPw = 'UsbSecure2026!';
      validKey = '892019-381029-481920-581920-391820-481920-581920-291820';
    } else if (bitlockerChoice === 'unlocked') {
      blStatus = 'Terenkripsi (Terbuka)';
      lockStatus = 'Unlocked';
      protStatus = 'Protection On';
      method = 'XTS-AES 256-bit';
      validPw = 'UsbSecure2026!';
    }

    const driveItem: DriveItem = {
      id: `drive-${Date.now()}`,
      letter: `${freeLetter}:`,
      volumeLabel: volumeLabel.trim() || 'NEW_DEVICE',
      deviceType,
      fileSystem: 'exFAT',
      totalSizeBytes: capacityGB * 1024 * 1024 * 1024,
      usedSizeBytes: Math.round(capacityGB * 0.45 * 1024 * 1024 * 1024),
      bitlockerStatus: blStatus,
      lockStatus,
      protectionStatus: protStatus,
      encryptionMethod: method,
      conversionStatus: bitlockerChoice === 'off' ? 'Fully Decrypted' : 'Used Space Only Encrypted',
      decryptionPercent: 0,
      isSystemDrive: false,
      isRemovable: true,
      modelName: `${deviceType} ${volumeLabel} USB 3.2`,
      serialNumber: `SN${Math.floor(10000000 + Math.random() * 90000000)}`,
      lastChecked: new Date().toLocaleTimeString('id-ID'),
      validPassword: validPw,
      validRecoveryKey: validKey,
      protectors: bitlockerChoice !== 'off' ? [
        {
          id: `{${Math.random().toString(36).substring(2, 10).toUpperCase()}-PROTECTOR}`,
          type: 'Password',
          description: 'Password BitLocker to Go',
          createdDate: new Date().toISOString().slice(0, 10)
        },
        {
          id: `{${Math.random().toString(36).substring(2, 10).toUpperCase()}-RECOVERY}`,
          type: 'Recovery Password',
          description: 'Kunci Pemulihan 48-Digit',
          createdDate: new Date().toISOString().slice(0, 10),
          recoveryPasswordPreview: '892019-381029-******-******-******-******-******-******'
        }
      ] : []
    };

    onAddDrive(driveItem);
    onClose();
  };

  const handleQuickPreset = (preset: { label: string; type: DeviceType; cap: number; state: 'locked' | 'unlocked' | 'off' }) => {
    setVolumeLabel(preset.label);
    setDeviceType(preset.type);
    setCapacityGB(preset.cap);
    setBitlockerChoice(preset.state);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0e131f] border border-[#232f48] rounded-2xl shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-[#0a0e17] border-b border-[#1b253b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Usb className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Simulasi Deteksi Perangkat Penyimpanan Baru
              </h3>
              <p className="text-xs text-slate-400">
                Hubungkan Flashdisk USB, SSD Eksternal, atau Hardisk baru ke komputer
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

        <form onSubmit={handleCreate} className="p-5 space-y-4">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Preset Cepat Perangkat Populer:</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset({ label: 'SANDISK_64GB', type: 'USB Flashdisk', cap: 64, state: 'locked' })}
                className="p-2 rounded-lg bg-[#121826] hover:bg-[#1a2336] border border-[#212c42] text-left text-xs transition-colors"
              >
                <div className="font-semibold text-white">SanDisk 64GB</div>
                <div className="text-[10px] text-rose-400 font-mono">USB Terkunci</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset({ label: 'CRUCIAL_X9_SSD', type: 'SSD Eksternal', cap: 1000, state: 'unlocked' })}
                className="p-2 rounded-lg bg-[#121826] hover:bg-[#1a2336] border border-[#212c42] text-left text-xs transition-colors"
              >
                <div className="font-semibold text-white">Crucial 1TB SSD</div>
                <div className="text-[10px] text-emerald-400 font-mono">Terenkripsi Buka</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset({ label: 'TOSHIBA_EXT_HDD', type: 'Hardisk Eksternal', cap: 2000, state: 'off' })}
                className="p-2 rounded-lg bg-[#121826] hover:bg-[#1a2336] border border-[#212c42] text-left text-xs transition-colors"
              >
                <div className="font-semibold text-white">Toshiba 2TB HDD</div>
                <div className="text-[10px] text-slate-400 font-mono">Non-Enkripsi</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Huruf Drive Baru
              </label>
              <div className="px-3 py-2 bg-[#121826] border border-[#232f48] rounded-xl text-sm font-mono font-bold text-blue-400">
                {freeLetter}:
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Label Volume
              </label>
              <input
                type="text"
                value={volumeLabel}
                onChange={(e) => setVolumeLabel(e.target.value)}
                className="w-full bg-[#121826] border border-[#232f48] focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jenis Perangkat
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                className="w-full bg-[#121826] border border-[#232f48] focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="USB Flashdisk">USB Flashdisk</option>
                <option value="SSD Eksternal">SSD Eksternal</option>
                <option value="Hardisk Eksternal">Hardisk Eksternal</option>
                <option value="Hardisk Internal">Hardisk Internal</option>
                <option value="SSD Internal">SSD Internal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kapasitas (GB)
              </label>
              <input
                type="number"
                value={capacityGB}
                onChange={(e) => setCapacityGB(Math.max(1, parseInt(e.target.value) || 16))}
                className="w-full bg-[#121826] border border-[#232f48] focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Status Awal BitLocker
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBitlockerChoice('locked')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border ${
                  bitlockerChoice === 'locked'
                    ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                    : 'bg-[#121826] border-[#212c42] text-slate-400'
                }`}
              >
                🔒 Terkunci (Locked)
              </button>
              <button
                type="button"
                onClick={() => setBitlockerChoice('unlocked')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border ${
                  bitlockerChoice === 'unlocked'
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                    : 'bg-[#121826] border-[#212c42] text-slate-400'
                }`}
              >
                🛡️ Terbuka (Unlocked)
              </button>
              <button
                type="button"
                onClick={() => setBitlockerChoice('off')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border ${
                  bitlockerChoice === 'off'
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-[#121826] border-[#212c42] text-slate-400'
                }`}
              >
                ⚪ Nonaktif (Off)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1b253b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#161d2d] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tancapkan Drive ke Sistem</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
