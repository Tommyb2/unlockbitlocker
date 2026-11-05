import { DriveItem } from '../types/bitlocker';

export const INITIAL_DRIVES: DriveItem[] = [
  {
    id: 'drive-c',
    letter: 'C:',
    volumeLabel: 'Windows 11 OS',
    deviceType: 'SSD Internal',
    fileSystem: 'NTFS',
    totalSizeBytes: 1024 * 1024 * 1024 * 1000, // 1000 GB
    usedSizeBytes: 1024 * 1024 * 1024 * 280,  // 280 GB
    bitlockerStatus: 'Terenkripsi (Terbuka)',
    lockStatus: 'Unlocked',
    protectionStatus: 'Protection On',
    encryptionMethod: 'XTS-AES 256-bit',
    conversionStatus: 'Used Space Only Encrypted',
    decryptionPercent: 0,
    isSystemDrive: true,
    isRemovable: false,
    modelName: 'Samsung SSD 980 PRO 1TB PCIe 4.0 NVMe',
    serialNumber: 'S5GXNF0T104829J',
    lastChecked: new Date().toLocaleTimeString('id-ID'),
    protectors: [
      {
        id: '{C81447A2-7E19-4F54-949B-E0BE8A161201}',
        type: 'TPM',
        description: 'Trusted Platform Module 2.0 Hardware Security',
        createdDate: '2024-01-15 09:30'
      },
      {
        id: '{A11928B4-9F22-4D61-8C5A-F1DA83204910}',
        type: 'Recovery Password',
        description: '48-digit Numerical Password (Disimpan di Akun Entra/Microsoft)',
        createdDate: '2024-01-15 09:31',
        recoveryPasswordPreview: '582104-194028-******-******-******-******-******-******'
      }
    ]
  },
  {
    id: 'drive-d',
    letter: 'D:',
    volumeLabel: 'Data & Projek',
    deviceType: 'Hardisk Internal',
    fileSystem: 'NTFS',
    totalSizeBytes: 1024 * 1024 * 1024 * 2000, // 2000 GB
    usedSizeBytes: 1024 * 1024 * 1024 * 840,  // 840 GB
    bitlockerStatus: 'Tidak Terenkripsi (Off)',
    lockStatus: 'NotApplicable',
    protectionStatus: 'Protection Off',
    encryptionMethod: 'None',
    conversionStatus: 'Fully Decrypted',
    decryptionPercent: 0,
    isSystemDrive: false,
    isRemovable: false,
    modelName: 'Seagate BarraCuda 2TB SATA 6Gb/s',
    serialNumber: 'WCAV93028194',
    lastChecked: new Date().toLocaleTimeString('id-ID'),
    protectors: []
  },
  {
    id: 'drive-e',
    letter: 'E:',
    volumeLabel: 'KINGSTON_USB',
    deviceType: 'USB Flashdisk',
    fileSystem: 'exFAT',
    totalSizeBytes: 1024 * 1024 * 1024 * 32, // 32 GB
    usedSizeBytes: 1024 * 1024 * 1024 * 18.5, // 18.5 GB
    bitlockerStatus: 'Terenkripsi (Terkunci)',
    lockStatus: 'Locked',
    protectionStatus: 'Protection On',
    encryptionMethod: 'XTS-AES 128-bit',
    conversionStatus: 'Used Space Only Encrypted',
    decryptionPercent: 0,
    isSystemDrive: false,
    isRemovable: true,
    modelName: 'Kingston DataTraveler Exodia USB 3.2 Gen 1',
    serialNumber: '0014D11893FAEA90',
    lastChecked: new Date().toLocaleTimeString('id-ID'),
    validPassword: 'Password123!',
    validRecoveryKey: '459281-204918-384910-672019-194820-582019-301948-284019',
    protectors: [
      {
        id: '{E4910284-B831-4192-9C12-849102948192}',
        type: 'Password',
        description: 'Password Pengguna BitLocker to Go',
        createdDate: '2024-03-10 14:22'
      },
      {
        id: '{94819204-1829-4820-BA19-481029384910}',
        type: 'Recovery Password',
        description: 'Kunci Pemulihan 48-Digit Numerical Password',
        createdDate: '2024-03-10 14:23',
        recoveryPasswordPreview: '459281-204918-******-******-******-******-******-******'
      }
    ]
  },
  {
    id: 'drive-f',
    letter: 'F:',
    volumeLabel: 'Samsung_T7_Portable',
    deviceType: 'SSD Eksternal',
    fileSystem: 'NTFS',
    totalSizeBytes: 1024 * 1024 * 1024 * 1000, // 1000 GB
    usedSizeBytes: 1024 * 1024 * 1024 * 410,  // 410 GB
    bitlockerStatus: 'Sedang Dekripsi',
    lockStatus: 'Unlocked',
    protectionStatus: 'Protection Off',
    encryptionMethod: 'XTS-AES 128-bit',
    conversionStatus: 'Decryption in Progress',
    decryptionPercent: 48,
    isSystemDrive: false,
    isRemovable: true,
    modelName: 'Samsung Portable SSD T7 Shield USB 3.2 Gen 2',
    serialNumber: 'S6XNNS0T581029P',
    lastChecked: new Date().toLocaleTimeString('id-ID'),
    protectors: [
      {
        id: '{F9102834-1920-4829-9182-481920394810}',
        type: 'Password',
        description: 'Password BitLocker to Go',
        createdDate: '2024-02-18 11:05'
      }
    ]
  },
  {
    id: 'drive-g',
    letter: 'G:',
    volumeLabel: 'WD_MyPassport',
    deviceType: 'Hardisk Eksternal',
    fileSystem: 'NTFS',
    totalSizeBytes: 1024 * 1024 * 1024 * 2000, // 2000 GB
    usedSizeBytes: 1024 * 1024 * 1024 * 1350, // 1350 GB
    bitlockerStatus: 'Terenkripsi (Terbuka)',
    lockStatus: 'Unlocked',
    protectionStatus: 'Protection On',
    encryptionMethod: 'XTS-AES 256-bit',
    conversionStatus: 'Used Space Only Encrypted',
    decryptionPercent: 0,
    isSystemDrive: false,
    isRemovable: true,
    modelName: 'Western Digital My Passport Ultra 2.5 USB 3.0',
    serialNumber: 'WX21D80A1820',
    lastChecked: new Date().toLocaleTimeString('id-ID'),
    validPassword: 'BackupSecure2026',
    validRecoveryKey: '671829-391820-482019-581920-394820-192840-581920-482910',
    protectors: [
      {
        id: '{G9182039-4819-2039-8192-384910293849}',
        type: 'Password',
        description: 'Password BitLocker to Go',
        createdDate: '2023-11-20 16:40'
      },
      {
        id: '{D1920384-9102-3849-1029-482019283940}',
        type: 'Recovery Password',
        description: 'Kunci Pemulihan 48-Digit',
        createdDate: '2023-11-20 16:41',
        recoveryPasswordPreview: '671829-391820-******-******-******-******-******-******'
      }
    ]
  }
];
