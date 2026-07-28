import JSZip from 'jszip';
import { pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
import '../../../lib/pdf/worker';
import { IMAGE_FORMATS, RENDER_SCALES } from './exportOptions';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('Failed to encode image.'));
        else resolve(blob);
      },
      mime,
      quality
    );
  });
}

function baseName(fileName) {
  return fileName.replace(/\.pdf$/i, '') || 'document';
}

/**
 * Convert selected PDF pages to images and download (single file or ZIP).
 */
export async function exportPdfPagesAsImages(file, pageNumbers, options = {}) {
  const {
    formatId = 'png',
    scaleId = 'high',
    jpegQuality = 0.92,
    onProgress,
  } = options;

  const format = IMAGE_FORMATS[formatId] || IMAGE_FORMATS.png;
  const scale = (RENDER_SCALES[scaleId] || RENDER_SCALES.high).scale;

  if (!pageNumbers?.length) {
    toast.error('Select at least one page to export.');
    return false;
  }

  try {
    const sourceBytes = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: sourceBytes.slice(0) });
    const pdf = await loadingTask.promise;
    const name = baseName(file.name);
    const pad = String(Math.max(...pageNumbers)).length;
    const images = [];

    for (let i = 0; i < pageNumbers.length; i++) {
      const pageNumber = pageNumbers[i];
      onProgress?.(i + 1, pageNumbers.length);

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: format.id === 'png' });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      if (!context) throw new Error('Canvas is not available in this browser.');

      if (format.id === 'jpeg') {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      await page.render({ canvasContext: context, viewport }).promise;

      const blob = await canvasToBlob(
        canvas,
        format.mime,
        format.id === 'jpeg' ? jpegQuality : undefined
      );

      images.push({
        blob,
        filename: `${name}-page-${String(pageNumber).padStart(pad, '0')}.${format.extension}`,
      });

      canvas.width = 0;
      canvas.height = 0;
    }

    if (images.length === 1) {
      triggerDownload(images[0].blob, images[0].filename);
      toast.success('Image downloaded.');
      return true;
    }

    const zip = new JSZip();
    images.forEach((img) => zip.file(img.filename, img.blob));
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, `${name}-images.zip`);
    toast.success(`Exported ${images.length} images as a ZIP.`);
    return true;
  } catch (error) {
    console.error('PDF to Image error:', error);
    if (String(error?.message || error).toLowerCase().includes('encrypt')) {
      toast.error('This PDF is password-protected and cannot be converted.');
    } else {
      toast.error('Failed to convert PDF to images.');
    }
    return false;
  }
}

export async function getPdfPageCount(file) {
  try {
    const sourceBytes = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: sourceBytes.slice(0) });
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  } catch (error) {
    console.error('PDF page count error:', error);
    return null;
  }
}
