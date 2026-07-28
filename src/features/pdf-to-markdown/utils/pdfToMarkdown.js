import { pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
import '../../../lib/pdf/worker';
import { baseName } from './markdownOptions';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function itemsToLines(items) {
  const enriched = [];

  for (const item of items) {
    const str = item.str;
    if (!str || !str.trim()) continue;
    const tx = item.transform || [1, 0, 0, 1, 0, 0];
    const x = tx[4] ?? 0;
    const y = tx[5] ?? 0;
    const height = item.height || Math.hypot(tx[2] || 0, tx[3] || 0) || 12;
    enriched.push({
      str,
      x,
      y,
      height,
      fontName: item.fontName || '',
      hasEOL: Boolean(item.hasEOL),
    });
  }

  if (enriched.length === 0) return [];

  // Sort top-to-bottom, then left-to-right (PDF Y grows upward)
  enriched.sort((a, b) => {
    if (Math.abs(a.y - b.y) > Math.max(a.height, b.height) * 0.35) {
      return b.y - a.y;
    }
    return a.x - b.x;
  });

  const lines = [];
  let current = null;

  for (const item of enriched) {
    const threshold = Math.max(item.height, current?.height || 12) * 0.45;
    if (!current || Math.abs(current.y - item.y) > threshold) {
      current = {
        y: item.y,
        height: item.height,
        fontName: item.fontName,
        parts: [{ str: item.str, x: item.x }],
      };
      lines.push(current);
    } else {
      current.height = Math.max(current.height, item.height);
      if (item.height >= current.height * 0.95) current.fontName = item.fontName;
      current.parts.push({ str: item.str, x: item.x });
    }
  }

  return lines.map((line) => {
    line.parts.sort((a, b) => a.x - b.x);
    let text = '';
    for (let i = 0; i < line.parts.length; i++) {
      const part = line.parts[i];
      if (i > 0) {
        const prev = line.parts[i - 1];
        const gap = part.x - (prev.x + estimateWidth(prev.str, line.height));
        text += gap > line.height * 0.35 ? ' ' : '';
      }
      text += part.str;
    }
    return {
      text: text.replace(/\s+/g, ' ').trim(),
      height: line.height,
      fontName: line.fontName,
      y: line.y,
    };
  }).filter((line) => line.text.length > 0);
}

function estimateWidth(str, height) {
  return String(str).length * height * 0.5;
}

function median(values) {
  if (!values.length) return 12;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function isBoldFont(fontName) {
  return /bold|black|heavy|semibold/i.test(fontName || '');
}

function looksLikeListItem(text) {
  return /^([•·▪▫◦⦿◉*-]|\d+[.)]|[a-z][.)]|[ivxlcdm]+[.)])\s+/i.test(text);
}

function formatListLine(text) {
  const bullet = text.match(/^([•·▪▫◦⦿◉*-])\s+(.*)$/);
  if (bullet) return `- ${bullet[2]}`;

  const numbered = text.match(/^(\d+)[.)]\s+(.*)$/);
  if (numbered) return `${numbered[1]}. ${numbered[2]}`;

  const alpha = text.match(/^([a-z])[.)]\s+(.*)$/i);
  if (alpha) return `- ${alpha[2]}`;

  return `- ${text.replace(/^([ivxlcdm]+)[.)]\s+/i, '')}`;
}

function headingLevel(line, bodyHeight) {
  const ratio = line.height / bodyHeight;
  const bold = isBoldFont(line.fontName);
  const short = line.text.length < 90 && !/[.!?]$/.test(line.text);

  if (ratio >= 1.55 && short) return 1;
  if (ratio >= 1.3 && short) return 2;
  if ((ratio >= 1.15 || (bold && ratio >= 1.05)) && short) return 3;
  return 0;
}

function linesToMarkdown(lines) {
  if (!lines.length) return '_No extractable text on this page._';

  const bodyHeight = median(lines.map((l) => l.height));
  const blocks = [];

  for (const line of lines) {
    if (looksLikeListItem(line.text)) {
      blocks.push({ type: 'list', text: formatListLine(line.text) });
      continue;
    }

    const level = headingLevel(line, bodyHeight);
    if (level > 0) {
      blocks.push({ type: 'heading', level, text: line.text });
      continue;
    }

    blocks.push({ type: 'para', text: line.text });
  }

  // Merge consecutive paragraph lines into paragraphs; keep lists/headings separate
  const out = [];
  let paraBuf = [];

  const flushPara = () => {
    if (!paraBuf.length) return;
    out.push(paraBuf.join(' '));
    paraBuf = [];
  };

  for (const block of blocks) {
    if (block.type === 'para') {
      paraBuf.push(block.text);
      continue;
    }
    flushPara();
    if (block.type === 'heading') {
      out.push(`${'#'.repeat(block.level)} ${block.text}`);
    } else if (block.type === 'list') {
      out.push(block.text);
    }
  }
  flushPara();

  // Join list items tightly; blank line between other blocks
  const result = [];
  for (let i = 0; i < out.length; i++) {
    const line = out[i];
    const prev = result[result.length - 1];
    const isList = /^(- |\d+\. )/.test(line);
    const prevList = prev && /^(- |\d+\. )/.test(prev);
    if (prev && !(isList && prevList)) result.push('');
    result.push(line);
  }

  return result.join('\n');
}

async function extractPageMarkdown(page) {
  const content = await page.getTextContent({
    normalizeWhitespace: true,
    disableCombineTextItems: false,
  });
  const lines = itemsToLines(content.items || []);
  return linesToMarkdown(lines);
}

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
 * Convert selected PDF pages to Markdown.
 * @returns {Promise<string|null>} markdown string
 */
export async function convertPdfToMarkdown(file, pageNumbers, options = {}) {
  const { pageBreakMode = 'heading', includeTitle = true, onProgress } = options;

  if (!pageNumbers?.length) {
    toast.error('Select at least one page to convert.');
    return null;
  }

  try {
    const bytes = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: bytes.slice(0) }).promise;
    const sections = [];

    if (includeTitle) {
      sections.push(`# ${baseName(file.name)}`);
      sections.push('');
    }

    for (let i = 0; i < pageNumbers.length; i++) {
      const pageNumber = pageNumbers[i];
      onProgress?.(i + 1, pageNumbers.length);

      const page = await pdf.getPage(pageNumber);
      const md = await extractPageMarkdown(page);

      if (pageBreakMode === 'heading') {
        if (sections.length && sections[sections.length - 1] !== '') sections.push('');
        sections.push(`## Page ${pageNumber}`);
        sections.push('');
        sections.push(md);
      } else if (pageBreakMode === 'rule') {
        if (i > 0 || includeTitle) {
          if (sections.length && sections[sections.length - 1] !== '') sections.push('');
          sections.push('---');
          sections.push('');
        }
        sections.push(md);
      } else {
        if (sections.length && sections[sections.length - 1] !== '') sections.push('');
        sections.push(md);
      }
    }

    const markdown = `${sections.join('\n').trim()}\n`;
    return markdown;
  } catch (error) {
    console.error('PDF to Markdown error:', error);
    if (String(error?.message || error).toLowerCase().includes('password')) {
      toast.error('This PDF is password-protected. Unlock it first.');
    } else {
      toast.error('Failed to convert PDF to Markdown.');
    }
    return null;
  }
}

export function downloadMarkdown(markdown, fileName) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, `${baseName(fileName)}.md`);
  toast.success('Markdown downloaded.');
}

export async function copyMarkdown(markdown) {
  try {
    await navigator.clipboard.writeText(markdown);
    toast.success('Copied to clipboard.');
    return true;
  } catch (error) {
    console.error(error);
    toast.error('Could not copy to clipboard.');
    return false;
  }
}
