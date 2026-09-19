import JSZip from 'jszip';
import { EXTENSION_FILES } from '../extension-files';

/**
 * Generates simple colored canvas icon as PNG data URL
 */
function createIconBlob(size: number): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(new Blob());
      return;
    }

    // Background rounded rect
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.2);
    ctx.fill();

    // Inner marker pin
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const cx = size / 2;
    const cy = size * 0.42;
    const r = size * 0.26;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Pin tip
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.7, cy + r * 0.4);
    ctx.lineTo(cx, size * 0.85);
    ctx.lineTo(cx + r * 0.7, cy + r * 0.4);
    ctx.fill();

    // Pin center hole
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
    ctx.fill();

    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, 'image/png');
  });
}

export async function downloadExtensionZip(): Promise<void> {
  const zip = new JSZip();

  // Add source files
  for (const file of EXTENSION_FILES) {
    zip.file(file.path, file.content);
  }

  // Generate icon files
  try {
    const icon16 = await createIconBlob(16);
    const icon48 = await createIconBlob(48);
    const icon128 = await createIconBlob(128);

    zip.file('icons/icon16.png', icon16);
    zip.file('icons/icon48.png', icon48);
    zip.file('icons/icon128.png', icon128);
  } catch (err) {
    console.warn('Could not generate canvas icon, skipping icons:', err);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'google-maps-no-website-scraper-v1.0.0.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
