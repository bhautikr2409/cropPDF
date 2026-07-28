import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';
import { cropToRatios, screenCropToPdfBox } from './cropMath';

/**
 * Crop every page using the selection drawn on the currently rendered page,
 * then trigger a browser download.
 *
 * The crop rectangle is converted to page-relative ratios so the same visual
 * crop applies to all pages (typical for margin trimming).
 */
export async function downloadCroppedPdf({ fileUrl, cropArea, containerRef }) {
  if (!fileUrl || !cropArea || !containerRef?.current) return;

  try {
    const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const croppedPdf = await PDFDocument.create();
    const pages = pdfDoc.getPages();

    const container = containerRef.current;
    const pageElement = container.querySelector('.react-pdf__Page');

    if (!pageElement) {
      toast.error('PDF page is not ready yet. Please wait and try again.');
      return;
    }

    const canvasElement = pageElement.querySelector('canvas') || pageElement;
    const pageRect = canvasElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const pageLeft = pageRect.left - containerRect.left;
    const pageTop = pageRect.top - containerRect.top;

    const intersectLeft = Math.max(cropArea.x, pageLeft);
    const intersectTop = Math.max(cropArea.y, pageTop);
    const intersectRight = Math.min(cropArea.x + cropArea.width, pageLeft + pageRect.width);
    const intersectBottom = Math.min(cropArea.y + cropArea.height, pageTop + pageRect.height);

    if (intersectRight <= intersectLeft || intersectBottom <= intersectTop) {
      toast.error('Please select a crop area over the PDF page.');
      return;
    }

    const ratios = cropToRatios(
      {
        x: intersectLeft,
        y: intersectTop,
        width: intersectRight - intersectLeft,
        height: intersectBottom - intersectTop,
      },
      pageLeft,
      pageTop,
      pageRect.width,
      pageRect.height
    );

    for (let i = 0; i < pages.length; i++) {
      const originalPage = pages[i];
      const [copiedPage] = await croppedPdf.copyPages(pdfDoc, [i]);

      const mediaBox = originalPage.getMediaBox() || {
        x: 0,
        y: 0,
        width: originalPage.getWidth(),
        height: originalPage.getHeight(),
      };

      const pdfWidth = mediaBox.width || originalPage.getWidth();
      const pdfHeight = mediaBox.height || originalPage.getHeight();

      const pageSizedLocal = {
        x: ratios.x * pdfWidth,
        y: ratios.y * pdfHeight,
        width: ratios.width * pdfWidth,
        height: ratios.height * pdfHeight,
      };

      const { pdfX, pdfY, pdfW, pdfH } = screenCropToPdfBox(
        pageSizedLocal,
        { width: pdfWidth, height: pdfHeight },
        {
          x: mediaBox.x || 0,
          y: mediaBox.y || 0,
          width: pdfWidth,
          height: pdfHeight,
        }
      );

      copiedPage.setCropBox(pdfX, pdfY, pdfW, pdfH);
      copiedPage.setMediaBox(pdfX, pdfY, pdfW, pdfH);
      croppedPdf.addPage(copiedPage);
    }

    const pdfBytes = await croppedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'cropped.pdf';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('PDF cropped and downloaded successfully!');
  } catch (error) {
    console.error('Error downloading cropped PDF:', error);
    toast.error('Failed to download cropped PDF.');
  }
}
