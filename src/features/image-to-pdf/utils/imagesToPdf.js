import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function isJpeg(file) {
  return file.type === 'image/jpeg' || file.type === 'image/jpg' || /\.jpe?g$/i.test(file.name);
}

function isPng(file) {
  return file.type === 'image/png' || /\.png$/i.test(file.name);
}

/**
 * Convert a WEBP (or other) image to PNG bytes via canvas so pdf-lib can embed it.
 */
async function fileToPngBytes(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available.');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to convert image.'))), 'image/png');
  });

  canvas.width = 0;
  canvas.height = 0;
  return new Uint8Array(await blob.arrayBuffer());
}

/**
 * Build a PDF from image files (one image per page) and download it.
 * @param {{ id: string, file: File }[]} items
 * @param {{ pageSize?: 'fit' | 'a4' }} [options]
 */
export async function imagesToPdfAndDownload(items, options = {}) {
  const { pageSize = 'fit' } = options;

  if (!items?.length) {
    toast.error('Add at least one image.');
    return false;
  }

  try {
    const pdfDoc = await PDFDocument.create();

    // A4 in points
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    for (const item of items) {
      const file = item.file;
      const bytes = new Uint8Array(await file.arrayBuffer());

      let image;
      if (isJpeg(file)) {
        image = await pdfDoc.embedJpg(bytes);
      } else if (isPng(file)) {
        image = await pdfDoc.embedPng(bytes);
      } else {
        const pngBytes = await fileToPngBytes(file);
        image = await pdfDoc.embedPng(pngBytes);
      }

      const imgWidth = image.width;
      const imgHeight = image.height;

      let pageWidth;
      let pageHeight;
      let drawWidth;
      let drawHeight;
      let x = 0;
      let y = 0;

      if (pageSize === 'a4') {
        pageWidth = A4_WIDTH;
        pageHeight = A4_HEIGHT;
        const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        drawWidth = imgWidth * scale;
        drawHeight = imgHeight * scale;
        x = (pageWidth - drawWidth) / 2;
        y = (pageHeight - drawHeight) / 2;
      } else {
        // Fit page to image (1 CSS pixel ≈ 0.75 PDF point keeps reasonable print size)
        const ptScale = 0.75;
        pageWidth = imgWidth * ptScale;
        pageHeight = imgHeight * ptScale;
        drawWidth = pageWidth;
        drawHeight = pageHeight;
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    triggerDownload(blob, 'images.pdf');
    toast.success(`Created PDF with ${items.length} page${items.length === 1 ? '' : 's'}.`);
    return true;
  } catch (error) {
    console.error('Image to PDF error:', error);
    toast.error('Failed to create PDF from images.');
    return false;
  }
}
