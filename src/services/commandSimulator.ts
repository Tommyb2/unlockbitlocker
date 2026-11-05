import { DriveItem } from '../types/bitlocker';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function generateManageBdeStatusAll(drives: DriveItem[]): string {
  let output = `BitLocker Drive Encryption: Configuration Tool version 10.0.22631\nCopyright (C) 2013 Microsoft Corporation. All rights reserved.\n\n`;
  output += `Disk volumes that can be protected with\nBitLocker Drive Encryption:\n`;

  for (const drive of drives) {
    output += `\nVolume ${drive.letter} [${drive.volumeLabel}]\n`;
    output += `    [${drive.deviceType.toUpperCase()} Volume]\n`;
    output += `    Size:                      ${formatBytes(drive.totalSizeBytes)}\n`;
    output += `    BitLocker Version:         2.0\n`;
    output += `    Conversion Status:         ${drive.conversionStatus}\n`;
    if (drive.bitlockerStatus === 'Sedang Dekripsi') {
      output += `    Percentage Encrypted:      ${Math.max(0, 100 - drive.decryptionPercent)}%\n`;
    } else if (drive.bitlockerStatus === 'Sedang Enkripsi') {
      output += `    Percentage Encrypted:      ${drive.decryptionPercent}%\n`;
    } else if (drive.bitlockerStatus === 'Tidak Terenkripsi (Off)') {
      output += `    Percentage Encrypted:      0.0%\n`;
    } else {
      output += `    Percentage Encrypted:      100.0%\n`;
    }
    output += `    Encryption Method:         ${drive.encryptionMethod}\n`;
    output += `    Protection Status:         ${drive.protectionStatus}\n`;
    output += `    Lock Status:               ${drive.lockStatus}\n`;
    output += `    Identification Field:      None\n`;
    output += `    Automatic Unlock:          Disabled\n`;
    output += `    Key Protectors:\n`;
    if (drive.protectors.length === 0) {
      output += `        None Found\n`;
    } else {
      for (const p of drive.protectors) {
        output += `        ${p.type}\n`;
        output += `          ID: ${p.id}\n`;
      }
    }
  }

  return output;
}

export function generateManageBdeStatusSingle(drive: DriveItem): string {
  let output = `BitLocker Drive Encryption: Configuration Tool version 10.0.22631\nCopyright (C) 2013 Microsoft Corporation. All rights reserved.\n\n`;
  output += `Volume ${drive.letter} [${drive.volumeLabel}]\n`;
  output += `    [${drive.deviceType.toUpperCase()} Volume]\n`;
  output += `    Size:                      ${formatBytes(drive.totalSizeBytes)}\n`;
  output += `    BitLocker Version:         2.0\n`;
  output += `    Conversion Status:         ${drive.conversionStatus}\n`;
  if (drive.bitlockerStatus === 'Sedang Dekripsi') {
    output += `    Percentage Encrypted:      ${Math.max(0, 100 - drive.decryptionPercent)}%\n`;
  } else if (drive.bitlockerStatus === 'Sedang Enkripsi') {
    output += `    Percentage Encrypted:      ${drive.decryptionPercent}%\n`;
  } else if (drive.bitlockerStatus === 'Tidak Terenkripsi (Off)') {
    output += `    Percentage Encrypted:      0.0%\n`;
  } else {
    output += `    Percentage Encrypted:      100.0%\n`;
  }
  output += `    Encryption Method:         ${drive.encryptionMethod}\n`;
  output += `    Protection Status:         ${drive.protectionStatus}\n`;
  output += `    Lock Status:               ${drive.lockStatus}\n`;
  output += `    Identification Field:      None\n`;
  output += `    Automatic Unlock:          Disabled\n`;
  output += `    Key Protectors:\n`;
  if (drive.protectors.length === 0) {
    output += `        None Found\n`;
  } else {
    for (const p of drive.protectors) {
      output += `        ${p.type}\n`;
      output += `          ID: ${p.id}\n`;
    }
  }
  return output;
}

export function generatePowerShellBitLockerVolume(drives: DriveItem[]): string {
  let output = `VolumeType      Mount CapacityGB VolumeStatus           Encryption KeyProtector              AutoUnlock\n`;
  output += `                Point                    Percentage             Method                               Enabled   \n`;
  output += `----------      ----- ---------- ------------           ---------- ------------              ----------\n`;

  for (const d of drives) {
    const vType = d.isSystemDrive ? 'OperatingSystem' : d.isRemovable ? 'Data' : 'Fixed';
    const capGB = (d.totalSizeBytes / (1024 * 1024 * 1024)).toFixed(1).padStart(10, ' ');
    const mount = d.letter.padEnd(5, ' ');
    let vStatus = 'FullyDecrypted';
    let encPct = '0%';
    if (d.bitlockerStatus === 'Sedang Dekripsi') {
      vStatus = 'DecryptionInProgress';
      encPct = `${Math.max(0, 100 - d.decryptionPercent)}%`;
    } else if (d.bitlockerStatus.includes('Terenkripsi')) {
      vStatus = 'FullyEncrypted';
      encPct = '100%';
    }

    const prot = d.protectors.map(p => p.type.replace(/\s+/g, '')).join(',') || 'None';
    output += `${vType.padEnd(15, ' ')} ${mount} ${capGB} ${vStatus.padEnd(22, ' ')} ${encPct.padEnd(10, ' ')} ${d.encryptionMethod.padEnd(12, ' ')} {${prot}} False\n`;
  }

  return output;
}
