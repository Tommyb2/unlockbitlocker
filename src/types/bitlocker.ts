export type DeviceType = 
  | 'USB Flashdisk' 
  | 'Hardisk Eksternal' 
  | 'SSD Eksternal' 
  | 'Hardisk Internal' 
  | 'SSD Internal';

export type BitLockerStatus = 
  | 'Terenkripsi (Terkunci)' 
  | 'Terenkripsi (Terbuka)' 
  | 'Sedang Dekripsi' 
  | 'Sedang Enkripsi' 
  | 'Tidak Terenkripsi (Off)'
  | 'Dekripsi Dijeda';

export type ProtectionStatus = 
  | 'Protection On' 
  | 'Protection Off' 
  | 'Protection Unknown';

export type EncryptionMethod = 
  | 'XTS-AES 128-bit' 
  | 'XTS-AES 256-bit' 
  | 'AES-CBC 128-bit' 
  | 'AES-CBC 256-bit' 
  | 'None';

export type LockStatus = 'Locked' | 'Unlocked' | 'NotApplicable';

export interface KeyProtector {
  id: string;
  type: 'Password' | 'Recovery Password' | 'TPM' | 'TPM + PIN' | 'Smart Card';
  description: string;
  createdDate: string;
  recoveryPasswordPreview?: string; // Partial preview e.g. 48-digit masked
}

export interface DriveItem {
  id: string;
  letter: string; // e.g., "E:"
  volumeLabel: string; // e.g., "KINGSTON_32"
  deviceType: DeviceType;
  fileSystem: 'NTFS' | 'exFAT' | 'FAT32';
  totalSizeBytes: number; // e.g. 32000000000
  usedSizeBytes: number;
  bitlockerStatus: BitLockerStatus;
  lockStatus: LockStatus;
  protectionStatus: ProtectionStatus;
  encryptionMethod: EncryptionMethod;
  conversionStatus: string; // e.g., "Fully Decrypted", "Used Space Only Encrypted", "Encryption in Progress"
  decryptionPercent: number; // 0 - 100
  isSystemDrive: boolean;
  isRemovable: boolean;
  modelName: string;
  serialNumber: string;
  protectors: KeyProtector[];
  lastChecked: string;
  // Simulated credentials for testing unlock
  validPassword?: string;
  validRecoveryKey?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  level: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR' | 'COMMAND';
  action: string;
  driveLetter: string;
  commandExecuted?: string;
  details: string;
}

export type ActiveTab = 'drives' | 'decryption' | 'terminal' | 'logs' | 'source_code' | 'help';
