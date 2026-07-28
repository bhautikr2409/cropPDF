import { PDFDocument, degrees } from 'pdf-lib';
import toast from 'react-hot-toast';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function normalizeAngle(angle) {
  const n = ((angle % 360) + 360) % 360;
  // PDF rotation must be a multiple of 90
  const snapped = Math.round(n / 90) * 90;
  return snapped === 360 ? 0 : snapped;
}

/**
 * Rotate selected pages (1-based) by delta degrees (e.g. 90, -90, 180).
 * Rotation is applied relative to each page's current rotation.
 */
export async function rotateAndDownload(file, pageNumbers, deltaDegrees) {
  if (!pageNumbers?.length) {
    toast.error('Select at least one page to rotate.');
    return false;
  }

  try {
    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const pages = pdfDoc.getPages();

    for (const pageNumber of pageNumbers) {
      const page = pages[pageNumber - 1];
      if (!page) continue;

      const current = page.getRotation().angle || 0;
      const next = normalizeAngle(current + deltaDegrees);
      page.setRotation(degrees(next));
    }

    const outBytes = await pdfDoc.save();
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const name = file.name.replace(/\.pdf$/i, '') || 'document';
    triggerDownload(blob, `${name}-rotated.pdf`);

    toast.success(
      `Rotated ${pageNumbers.length} page${pageNumbers.length === 1 ? '' : 's'} by ${deltaDegrees > 0 ? '+' : ''}${deltaDegrees}°.`
    );
    return true;
  } catch (error) {
    console.error('Rotate PDF error:', error);
    if (String(error?.message || error).toLowerCase().includes('encrypt')) {
      toast.error('This PDF is password-protected and cannot be rotated.');
    } else {
      toast.error('Failed to rotate PDF. The file may be damaged.');
    }
    return false;
  }
}

export async function getPdfPageCount(file) {
  try {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    return doc.getPageCount();
  } catch (error) {
    console.error('PDF page count error:', error);
    return null;
  }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
