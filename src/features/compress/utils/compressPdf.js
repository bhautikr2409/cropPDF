import { PDFDocument } from 'pdf-lib';
import { pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
import '../../../lib/pdf/worker';
import { COMPRESS_LEVELS } from './compressLevels';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function canvasToJpegBytes(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error('Failed to encode page image.'));
          return;
        }
        resolve(new Uint8Array(await blob.arrayBuffer()));
      },
      'image/jpeg',
      quality
    );
  });
}

/**
 * Compress a PDF by rasterizing each page to JPEG and rebuilding the document.
 * This is lossy (text becomes an image) but reliably reduces size in the browser.
 *
 * @param {File} file
 * @param {keyof typeof COMPRESS_LEVELS} levelId
 * @param {{ onProgress?: (current: number, total: number) => void }} [options]
 * @returns {Promise<{ blob: Blob, bytes: Uint8Array, pageCount: number } | null>}
 */
export async function compressPdfFile(file, levelId = 'recommended', options = {}) {
  const level = COMPRESS_LEVELS[levelId] || COMPRESS_LEVELS.recommended;
  const { onProgress } = options;

  try {
    const sourceBytes = await file.arrayBuffer();
    // Copy buffer — pdf.js may detach the ArrayBuffer it receives.
    const loadingTask = pdfjs.getDocument({ data: sourceBytes.slice(0) });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    if (pageCount < 1) {
      toast.error('This PDF has no pages to compress.');
      return null;
    }

    const outDoc = await PDFDocument.create();

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      onProgress?.(pageNumber, pageCount);

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: level.scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: false });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      if (!context) {
        throw new Error('Canvas is not available in this browser.');
      }

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      const jpegBytes = await canvasToJpegBytes(canvas, level.quality);
      const image = await outDoc.embedJpg(jpegBytes);

      // pdf.js viewport at scale 1 ≈ PDF points (72 DPI). Keep page size in points.
      const widthPt = viewport.width / level.scale;
      const heightPt = viewport.height / level.scale;
      const pdfPage = outDoc.addPage([widthPt, heightPt]);

      pdfPage.drawImage(image, {
        x: 0,
        y: 0,
        width: widthPt,
        height: heightPt,
      });

      // Help GC on large documents
      canvas.width = 0;
      canvas.height = 0;
    }

    const compressedBytes = await outDoc.save({ useObjectStreams: true });
    const blob = new Blob([compressedBytes], { type: 'application/pdf' });

    return { blob, bytes: compressedBytes, pageCount };
  } catch (error) {
    console.error('Compress PDF error:', error);
    if (String(error?.message || error).toLowerCase().includes('encrypt')) {
      toast.error('This PDF is password-protected and cannot be compressed.');
    } else {
      toast.error('Failed to compress PDF. The file may be damaged.');
    }
    return null;
  }
}

export async function compressAndDownload(file, levelId, options = {}) {
  const result = await compressPdfFile(file, levelId, options);
  if (!result) return null;

  const name = file.name.replace(/\.pdf$/i, '') || 'document';
  triggerDownload(result.blob, `${name}-compressed.pdf`);

  return result;
}

export async function getPdfMeta(file) {
  try {
    const sourceBytes = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: sourceBytes.slice(0) });
    const pdf = await loadingTask.promise;
    return { pageCount: pdf.numPages };
  } catch (error) {
    console.error('PDF meta error:', error);
    return null;
  }
}
