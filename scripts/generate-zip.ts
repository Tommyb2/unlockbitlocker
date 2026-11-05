import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { WPF_PROJECT_FILES } from '../src/data/wpfProjectFiles.ts';

async function main() {
  const zip = new JSZip();

  for (const file of WPF_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  const outDir = path.resolve('public');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const outFile = path.join(outDir, 'BitLockerAdministratorPro-Windows.zip');
  fs.writeFileSync(outFile, buffer);

  console.log(`Successfully generated ${outFile} (${buffer.length} bytes)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
