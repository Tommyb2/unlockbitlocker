/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_DRIVES } from './data/initialDrives';
import { DriveItem, ActiveTab, ActivityLog } from './types/bitlocker';
import { WindowHeader } from './components/WindowHeader';
import { Sidebar } from './components/Sidebar';
import { DriveList } from './components/DriveList';
import { BitLockerDetailPanel } from './components/BitLockerDetailPanel';
import { UnlockModal } from './components/UnlockModal';
import { DecryptConfirmModal } from './components/DecryptConfirmModal';
import { DecryptionMonitorView } from './components/DecryptionMonitorView';
import { PowerShellConsole } from './components/PowerShellConsole';
import { ActivityLogView } from './components/ActivityLogView';
import { WpfSourceCodeView } from './components/WpfSourceCodeView';
import { HelpManualView } from './components/HelpManualView';
import { NewDeviceModal } from './components/NewDeviceModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';

export default function App() {
  const [drives, setDrives] = useState<DriveItem[]>(INITIAL_DRIVES);
  const [selectedDriveId, setSelectedDriveId] = useState<string | null>('drive-e');
  const [activeTab, setActiveTab] = useState<ActiveTab>('drives');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [unlockDrive, setUnlockDrive] = useState<DriveItem | null>(null);
  const [decryptDrive, setDecryptDrive] = useState<DriveItem | null>(null);
  const [isNewDeviceModalOpen, setIsNewDeviceModalOpen] = useState(false);

  // Terminal initial preset command
  const [terminalCmd, setTerminalCmd] = useState<string | undefined>(undefined);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 'welcome-toast',
      type: 'info',
      title: 'BitLocker Administrator Pro Siap',
      message: 'Hak akses Windows Administrator aktif. 5 volume terdeteksi pada sistem.'
    }
  ]);

  // Activity Log
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString('id-ID'),
      level: 'INFO',
      action: 'Inisialisasi Sistem Keamanan',
      driveLetter: 'SYS',
      commandExecuted: 'manage-bde -status',
      details: 'Memindai seluruh drive internal NVMe dan perangkat eksternal USB.'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString('id-ID'),
      level: 'WARNING',
      action: 'Deteksi Drive Terkunci',
      driveLetter: 'E:',
      commandExecuted: 'manage-bde -status E:',
      details: 'Drive USB Flashdisk E: [KINGSTON_USB] terdeteksi dalam status terkunci BitLocker to Go.'
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString('id-ID'),
      level: 'COMMAND',
      action: 'Memulai Dekripsi Resmi',
      driveLetter: 'F:',
      commandExecuted: 'manage-bde -off F:',
      details: 'Proses dekripsi dimulai oleh Administrator pada volume Samsung T7 Portable SSD.'
    }
  ]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logActivity = (
    level: ActivityLog['level'],
    action: string,
    driveLetter: string,
    details: string,
    cmd?: string
  ) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      level,
      action,
      driveLetter,
      commandExecuted: cmd,
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Background Decryption Progress Engine
  useEffect(() => {
    const timer = setInterval(() => {
      setDrives(prevDrives => {
        let hasUpdated = false;
        const next = prevDrives.map(drive => {
          if (drive.bitlockerStatus === 'Sedang Dekripsi') {
            hasUpdated = true;
            const newPercent = drive.decryptionPercent + Math.floor(Math.random() * 4) + 3; // +3% to +6%

            if (newPercent >= 100) {
              // Decryption Completed
              addToast(
                'success',
                `Dekripsi Selesai: ${drive.letter}`,
                `Volume ${drive.letter} [${drive.volumeLabel}] berhasil didekripsi 100%. Proteksi BitLocker kini nonaktif.`
              );
              logActivity(
                'SUCCESS',
                `Dekripsi Selesai (100%)`,
                drive.letter,
                `Seluruh sektor volume [${drive.volumeLabel}] telah berhasil didekripsi. Status proteksi: Protection Off.`,
                `manage-bde -status ${drive.letter}`
              );

              return {
                ...drive,
                bitlockerStatus: 'Tidak Terenkripsi (Off)' as const,
                lockStatus: 'NotApplicable' as const,
                protectionStatus: 'Protection Off' as const,
                conversionStatus: 'Fully Decrypted',
                decryptionPercent: 0,
                encryptionMethod: 'None' as const,
                protectors: [],
                lastChecked: new Date().toLocaleTimeString('id-ID')
              };
            }

            return {
              ...drive,
              decryptionPercent: newPercent,
              lastChecked: new Date().toLocaleTimeString('id-ID')
            };
          }
          return drive;
        });

        return hasUpdated ? next : prevDrives;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    setDrives(prev => prev.map(d => ({
      ...d,
      lastChecked: new Date().toLocaleTimeString('id-ID')
    })));

    logActivity('INFO', 'Refresh Status Drive', 'ALL', 'Memindai ulang volume penyimpanan via manage-bde -status', 'manage-bde -status');
    addToast('info', 'Daftar Drive Diperbarui', 'Data partisi dan status BitLocker telah disinkronkan.');
    setIsRefreshing(false);
  };

  const handleUnlockSuccess = (driveLetter: string, method: 'Password' | 'RecoveryKey') => {
    setDrives(prev => prev.map(d => {
      if (d.letter === driveLetter) {
        return {
          ...d,
          lockStatus: 'Unlocked' as const,
          bitlockerStatus: 'Terenkripsi (Terbuka)' as const,
          lastChecked: new Date().toLocaleTimeString('id-ID')
        };
      }
      return d;
    }));

    addToast(
      'success',
      `Drive ${driveLetter} Terbuka`,
      `Volume berhasil dibuka kuncinya menggunakan ${method === 'Password' ? 'Password' : 'Recovery Key 48-Digit'}.`
    );
  };

  const handleConfirmDecrypt = (driveLetter: string) => {
    setDrives(prev => prev.map(d => {
      if (d.letter === driveLetter) {
        return {
          ...d,
          bitlockerStatus: 'Sedang Dekripsi' as const,
          protectionStatus: 'Protection Off' as const,
          conversionStatus: 'Decryption in Progress',
          decryptionPercent: d.decryptionPercent > 0 ? d.decryptionPercent : 5,
          lastChecked: new Date().toLocaleTimeString('id-ID')
        };
      }
      return d;
    }));

    const cmd = `manage-bde -off ${driveLetter}`;
    logActivity(
      'COMMAND',
      `Memulai Dekripsi Drive ${driveLetter}`,
      driveLetter,
      `Perintah dekripsi resmi manage-bde -off dieksekusi dengan hak administrator.`,
      cmd
    );

    addToast(
      'warning',
      `Dekripsi Dimulai: ${driveLetter}`,
      `Proses dekripsi berjalan di latar belakang. Tetap hubungkan drive ke komputer sampai 100%.`
    );
  };

  const handlePauseResumeDecrypt = (drive: DriveItem) => {
    if (drive.bitlockerStatus === 'Sedang Dekripsi') {
      // Pause
      setDrives(prev => prev.map(d => d.id === drive.id ? { ...d, bitlockerStatus: 'Dekripsi Dijeda' } : d));
      logActivity('COMMAND', `Jeda Dekripsi ${drive.letter}`, drive.letter, 'Proses I/O dekripsi BitLocker dijeda sementara.', `manage-bde -pause ${drive.letter}`);
      addToast('info', `Dekripsi Dijeda: ${drive.letter}`, 'Proses dekripsi dihentikan sementara.');
    } else if (drive.bitlockerStatus === 'Dekripsi Dijeda') {
      // Resume
      setDrives(prev => prev.map(d => d.id === drive.id ? { ...d, bitlockerStatus: 'Sedang Dekripsi' } : d));
      logActivity('COMMAND', `Lanjutkan Dekripsi ${drive.letter}`, drive.letter, 'Melanjutkan kembali proses dekripsi BitLocker.', `manage-bde -resume ${drive.letter}`);
      addToast('info', `Dekripsi Dilanjutkan: ${drive.letter}`, 'Proses dekripsi aktif kembali.');
    }
  };

  const handleToggleEncrypt = (drive: DriveItem) => {
    if (drive.bitlockerStatus === 'Tidak Terenkripsi (Off)') {
      // Enable BitLocker
      setDrives(prev => prev.map(d => {
        if (d.id === drive.id) {
          return {
            ...d,
            bitlockerStatus: 'Terenkripsi (Terbuka)' as const,
            lockStatus: 'Unlocked' as const,
            protectionStatus: 'Protection On' as const,
            encryptionMethod: 'XTS-AES 128-bit' as const,
            conversionStatus: 'Used Space Only Encrypted',
            protectors: [
              {
                id: `{${Math.random().toString(36).substring(2, 10).toUpperCase()}-NEW}`,
                type: 'Password' as const,
                description: 'Password BitLocker to Go',
                createdDate: new Date().toISOString().slice(0, 10)
              }
            ]
          };
        }
        return d;
      }));

      logActivity('SUCCESS', `Aktifkan BitLocker pada ${drive.letter}`, drive.letter, 'BitLocker berhasil diaktifkan dengan metode XTS-AES 128-bit.', `manage-bde -on ${drive.letter} -used`);
      addToast('success', `BitLocker Diaktifkan: ${drive.letter}`, 'Proteksi enkripsi kini aktif.');
    }
  };

  const handleLockDrive = (drive: DriveItem) => {
    setDrives(prev => prev.map(d => {
      if (d.id === drive.id) {
        return {
          ...d,
          lockStatus: 'Locked' as const,
          bitlockerStatus: 'Terenkripsi (Terkunci)' as const,
          lastChecked: new Date().toLocaleTimeString('id-ID')
        };
      }
      return d;
    }));

    logActivity('COMMAND', `Kunci Drive ${drive.letter}`, drive.letter, 'Drive eksternal dikunci kembali via manage-bde -lock.', `manage-bde -lock ${drive.letter}`);
    addToast('warning', `Drive ${drive.letter} Dikunci`, 'Akses volume ditutup; memerlukan sandi untuk membukanya kembali.');
  };

  const handleAddDevice = (newDrive: DriveItem) => {
    setDrives(prev => [newDrive, ...prev]);
    setSelectedDriveId(newDrive.id);
    logActivity('INFO', `Perangkat USB Baru Terhubung`, newDrive.letter, `Volume [${newDrive.volumeLabel}] (${newDrive.deviceType}) berhasil terdeteksi.`);
    addToast('success', `Perangkat Baru Terdeteksi`, `Drive ${newDrive.letter} [${newDrive.volumeLabel}] kini siap dikelola.`);
  };

  const handleRunCommand = (cmd: string) => {
    setTerminalCmd(cmd);
    setActiveTab('terminal');
  };

  const selectedDrive = drives.find(d => d.id === selectedDriveId) || null;
  const encryptedCount = drives.filter(d => d.bitlockerStatus.includes('Terenkripsi')).length;
  const decryptingCount = drives.filter(d => d.bitlockerStatus === 'Sedang Dekripsi').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090a0f] text-slate-100 font-sans">
      {/* Top Windows 11 Chrome Header */}
      <WindowHeader
        totalDrives={drives.length}
        encryptedDrives={encryptedCount}
        decryptingDrives={decryptingCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        onAddDevice={() => setIsNewDeviceModalOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          drives={drives}
          selectedDriveId={selectedDriveId}
          onSelectDrive={setSelectedDriveId}
        />

        {/* Content Viewport */}
        <main className="flex-1 flex overflow-hidden bg-[#080a10]">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {activeTab === 'drives' && (
              <DriveList
                drives={drives}
                selectedDriveId={selectedDriveId}
                onSelectDrive={setSelectedDriveId}
                onOpenUnlock={setUnlockDrive}
                onOpenDecrypt={setDecryptDrive}
                onPauseResumeDecrypt={handlePauseResumeDecrypt}
                onToggleEncrypt={handleToggleEncrypt}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'decryption' && (
              <DecryptionMonitorView
                drives={drives}
                onPauseResume={handlePauseResumeDecrypt}
                onRefresh={handleRefresh}
                onRunCommand={handleRunCommand}
                onOpenDecryptModal={setDecryptDrive}
                isRefreshing={isRefreshing}
              />
            )}

            {activeTab === 'terminal' && (
              <PowerShellConsole
                drives={drives}
                onExecuteCommand={(cmd) => {
                  if (cmd.includes('-off')) {
                    const letter = cmd.split(' ')[2]?.toUpperCase() || 'E:';
                    handleConfirmDecrypt(letter);
                  }
                }}
                initialCommand={terminalCmd}
              />
            )}

            {activeTab === 'logs' && (
              <ActivityLogView
                logs={logs}
                onClearLogs={() => setLogs([])}
              />
            )}

            {activeTab === 'source_code' && (
              <WpfSourceCodeView />
            )}

            {activeTab === 'help' && (
              <HelpManualView />
            )}
          </div>

          {/* Collapsible BitLocker Detail Inspector (on Drives tab) */}
          {activeTab === 'drives' && selectedDrive && (
            <div className="w-80 xl:w-96 hidden lg:block shrink-0">
              <BitLockerDetailPanel
                drive={selectedDrive}
                onClose={() => setSelectedDriveId(null)}
                onOpenUnlock={setUnlockDrive}
                onOpenDecrypt={setDecryptDrive}
                onPauseResumeDecrypt={handlePauseResumeDecrypt}
                onRunCommand={handleRunCommand}
                onLockDrive={handleLockDrive}
              />
            </div>
          )}
        </main>
      </div>

      {/* Unlock Password & 48-Digit Recovery Key Modal */}
      <UnlockModal
        drive={unlockDrive}
        isOpen={!!unlockDrive}
        onClose={() => setUnlockDrive(null)}
        onUnlockSuccess={handleUnlockSuccess}
        onLogActivity={logActivity}
      />

      {/* Mandatory Safety Confirmation Modal for Decryption */}
      <DecryptConfirmModal
        drive={decryptDrive}
        isOpen={!!decryptDrive}
        onClose={() => setDecryptDrive(null)}
        onConfirmDecrypt={handleConfirmDecrypt}
      />

      {/* Plug in New Device Modal */}
      <NewDeviceModal
        isOpen={isNewDeviceModalOpen}
        onClose={() => setIsNewDeviceModalOpen(false)}
        onAddDrive={handleAddDevice}
        existingLetters={drives.map(d => d.letter)}
      />

      {/* Toast Alert Notifications */}
      <NotificationToast
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  );
}
