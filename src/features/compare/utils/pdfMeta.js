import { pdfjs } from 'react-pdf';
import '../../../lib/pdf/worker';

export async function getPdfPageCount(file) {
  try {
    const bytes = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: bytes.slice(0) }).promise;
    return pdf.numPages;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Extract plain text from a single PDF page (1-based).
 */
export async function extractPageText(file, pageNumber) {
  try {
    const bytes = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: bytes.slice(0) }).promise;
    if (pageNumber < 1 || pageNumber > pdf.numPages) return '';
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent({ normalizeWhitespace: true });
    return (content.items || [])
      .map((item) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (error) {
    console.error(error);
    return '';
  }
}
