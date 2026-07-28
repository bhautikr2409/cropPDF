import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function buildPdfFromPages(sourceDoc, pageNumbers1Based) {
  const out = await PDFDocument.create();
  const zeroBased = pageNumbers1Based.map((n) => n - 1);
  const copied = await out.copyPages(sourceDoc, zeroBased);
  copied.forEach((page) => out.addPage(page));
  return out.save();
}

function baseName(fileName) {
  return fileName.replace(/\.pdf$/i, '') || 'document';
}

/**
 * Extract selected pages into a single PDF and download it.
 */
export async function extractPagesToPdf(file, pageNumbers) {
  if (!pageNumbers?.length) {
    toast.error('Select at least one page to extract.');
    return false;
  }

  try {
    const bytes = await file.arrayBuffer();
    const source = await PDFDocument.load(bytes);
    const pdfBytes = await buildPdfFromPages(source, pageNumbers);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    triggerDownload(blob, `${baseName(file.name)}-extracted.pdf`);
    toast.success(`Extracted ${pageNumbers.length} page${pageNumbers.length === 1 ? '' : 's'}.`);
    return true;
  } catch (error) {
    console.error('Extract pages error:', error);
    toast.error(getLoadErrorMessage(error));
    return false;
  }
}

/**
 * Split every page into its own PDF and download as a ZIP.
 */
export async function splitEveryPage(file, pageCount) {
  if (pageCount < 1) {
    toast.error('This PDF has no pages to split.');
    return false;
  }

  try {
    const bytes = await file.arrayBuffer();
    const source = await PDFDocument.load(bytes);
    const zip = new JSZip();
    const name = baseName(file.name);
    const pad = String(pageCount).length;

    for (let i = 1; i <= pageCount; i++) {
      const pdfBytes = await buildPdfFromPages(source, [i]);
      zip.file(`${name}-page-${String(i).padStart(pad, '0')}.pdf`, pdfBytes);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, `${name}-split-pages.zip`);
    toast.success(`Split into ${pageCount} PDF${pageCount === 1 ? '' : 's'} (ZIP).`);
    return true;
  } catch (error) {
    console.error('Split every page error:', error);
    toast.error(getLoadErrorMessage(error));
    return false;
  }
}

/**
 * Split by custom ranges — each range becomes one PDF inside a ZIP
 * (or a single PDF if only one range).
 */
export async function splitByRanges(file, ranges) {
  if (!ranges?.length) {
    toast.error('Enter at least one page range.');
    return false;
  }

  try {
    const bytes = await file.arrayBuffer();
    const source = await PDFDocument.load(bytes);
    const name = baseName(file.name);

    if (ranges.length === 1) {
      const pdfBytes = await buildPdfFromPages(source, ranges[0]);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const label = formatRangeLabel(ranges[0]);
      triggerDownload(blob, `${name}-pages-${label}.pdf`);
      toast.success('Split PDF downloaded.');
      return true;
    }

    const zip = new JSZip();

    await Promise.all(
      ranges.map(async (pages, index) => {
        const pdfBytes = await buildPdfFromPages(source, pages);
        const label = formatRangeLabel(pages);
        zip.file(`${name}-part-${index + 1}-${label}.pdf`, pdfBytes);
      })
    );

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, `${name}-split-ranges.zip`);
    toast.success(`Created ${ranges.length} PDFs in a ZIP.`);
    return true;
  } catch (error) {
    console.error('Split by ranges error:', error);
    toast.error(getLoadErrorMessage(error));
    return false;
  }
}

function formatRangeLabel(pages) {
  if (pages.length === 1) return String(pages[0]);
  const first = pages[0];
  const last = pages[pages.length - 1];
  const isContiguous = pages.every((p, i) => i === 0 || p === pages[i - 1] + 1);
  return isContiguous ? `${first}-${last}` : pages.join('_');
}

function getLoadErrorMessage(error) {
  if (String(error?.message || error).toLowerCase().includes('encrypt')) {
    return 'This PDF is password-protected and cannot be split.';
  }
  return 'Failed to split PDF. The file may be damaged.';
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
