import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function createPageId() {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getPdfPageCount(file) {
  try {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
    return doc.getPageCount();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function baseName(fileName) {
  return fileName.replace(/\.pdf$/i, '') || 'document';
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getLoadErrorMessage(error) {
  const message = String(error?.message || error || '');
  if (/password|encrypted/i.test(message)) {
    return 'This PDF is password-protected. Unlock it first, then try again.';
  }
  return 'Could not organize this PDF. The file may be damaged or unsupported.';
}

/**
 * Build and download a PDF from an ordered page list.
 * @param {File} mainFile
 * @param {{ kind: 'original'|'inserted', pageNumber: number, insertId?: string }[]} pages
 * @param {Record<string, { file: File }>} insertFilesById
 */
export async function organizeAndDownload(mainFile, pages, insertFilesById = {}) {
  if (!pages?.length) {
    toast.error('Keep at least one page in the document.');
    return false;
  }

  try {
    const out = await PDFDocument.create();
    const cache = new Map();

    const loadDoc = async (key, file) => {
      if (cache.has(key)) return cache.get(key);
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
      cache.set(key, doc);
      return doc;
    };

    const mainDoc = await loadDoc('main', mainFile);

    for (const page of pages) {
      if (page.kind === 'original') {
        const index = page.pageNumber - 1;
        if (index < 0 || index >= mainDoc.getPageCount()) continue;
        const [copied] = await out.copyPages(mainDoc, [index]);
        out.addPage(copied);
        continue;
      }

      const insert = insertFilesById[page.insertId];
      if (!insert?.file) continue;
      const src = await loadDoc(page.insertId, insert.file);
      const index = page.pageNumber - 1;
      if (index < 0 || index >= src.getPageCount()) continue;
      const [copied] = await out.copyPages(src, [index]);
      out.addPage(copied);
    }

    if (out.getPageCount() < 1) {
      toast.error('No valid pages to save.');
      return false;
    }

    const pdfBytes = await out.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    triggerDownload(blob, `${baseName(mainFile.name)}-organized.pdf`);
    toast.success(`Saved ${out.getPageCount()} page${out.getPageCount() === 1 ? '' : 's'}.`);
    return true;
  } catch (error) {
    console.error('Organize PDF error:', error);
    toast.error(getLoadErrorMessage(error));
    return false;
  }
}
