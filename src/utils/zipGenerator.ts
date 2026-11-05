import JSZip from 'jszip';
import { WPF_PROJECT_FILES } from '../data/wpfProjectFiles';

export async function downloadWpfProjectZip(): Promise<boolean> {
  try {
    const zip = new JSZip();

    for (const file of WPF_PROJECT_FILES) {
      zip.file(file.path, file.content);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'BitLockerAdministratorPro-WPF-DotNet8.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to generate ZIP', err);
    return false;
  }
}
