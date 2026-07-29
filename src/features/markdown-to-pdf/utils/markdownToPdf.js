import { marked } from 'marked';
import fontkitImport from '@pdf-lib/fontkit';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import toast from 'react-hot-toast';
import { DEFAULT_TYPEFACE_ID, loadTypefaceFontBytes } from './typefaces';

const fontkit = fontkitImport?.default ?? fontkitImport;
export const MAX_MARKDOWN_BYTES = 2 * 1024 * 1024;

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 54;
const MARGIN_TOP = 54;
const MARGIN_BOTTOM = 54;

const COLORS = {
  text: rgb(0.12, 0.16, 0.22),
  muted: rgb(0.35, 0.4, 0.48),
  codeBg: rgb(0.95, 0.96, 0.98),
  codeBorder: rgb(0.86, 0.89, 0.93),
  quoteBar: rgb(0.45, 0.55, 0.72),
  link: rgb(0.15, 0.4, 0.75),
  hr: rgb(0.8, 0.83, 0.87),
};

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateMarkdownFile(file) {
  if (!file) {
    toast.error('Please select a Markdown file.');
    return false;
  }
  const name = file.name.toLowerCase();
  const okExt = /\.(md|markdown|txt|mdown|mkd)$/i.test(name);
  const okType =
    !file.type ||
    /markdown|text\/plain|text\/markdown|text\/x-markdown/i.test(file.type);
  if (!okExt && !okType) {
    toast.error('Please select a .md, .markdown, or .txt file.');
    return false;
  }
  if (file.size > MAX_MARKDOWN_BYTES) {
    toast.error('Markdown file must be under 2 MB.');
    return false;
  }
  if (file.size === 0) {
    toast.error('This file appears to be empty.');
    return false;
  }
  return true;
}

function baseName(fileName) {
  return (
    String(fileName || 'document')
      .replace(/\.(md|markdown|txt|mdown|mkd)$/i, '')
      .replace(/[^\w\-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'document'
  );
}

function wrapText(text, font, size, maxWidth) {
  const raw = toPdfText(text).replace(/\r\n/g, '\n');
  const paragraphs = raw.split('\n');
  const lines = [];

  for (const paragraph of paragraphs) {
    if (paragraph.length === 0) {
      lines.push('');
      continue;
    }
    const words = paragraph.split(/(\s+)/);
    let current = '';
    for (const word of words) {
      const next = current + word;
      const fitted = fitTextToFont(next, font) || next;
      if (font.widthOfTextAtSize(fitted, size) <= maxWidth || current.length === 0) {
        current = next;
      } else {
        lines.push(fitTextToFont(current.replace(/\s+$/, ''), font));
        current = word.replace(/^\s+/, '');
      }
    }
    if (current.length) lines.push(fitTextToFont(current.replace(/\s+$/, ''), font));
  }

  return lines.length ? lines : [''];
}

function inlinePlain(tokens) {
  if (!tokens?.length) return '';
  return tokens
    .map((token) => {
      switch (token.type) {
        case 'text':
          if (token.tokens?.length) return inlinePlain(token.tokens);
          return token.text || token.raw || '';
        case 'escape':
          return token.text || '';
        case 'codespan':
          return token.text || '';
        case 'strong':
        case 'em':
        case 'del':
          return inlinePlain(token.tokens) || token.text || '';
        case 'link':
          return `${inlinePlain(token.tokens) || token.text || ''}${
            token.href ? ` (${token.href})` : ''
          }`;
        case 'image':
          return token.text || token.title || '[image]';
        case 'br':
          return '\n';
        case 'paragraph':
          return inlinePlain(token.tokens) || token.text || '';
        default:
          if (token.tokens?.length) return inlinePlain(token.tokens);
          return token.text || token.raw || '';
      }
    })
    .join('');
}

function headingSize(depth) {
  const sizes = { 1: 22, 2: 18, 3: 15, 4: 13, 5: 12, 6: 11 };
  return sizes[depth] || 12;
}

/** Normalize markdown text for PDF drawing (no control chars / exotic unicode). */
function toPdfText(text) {
  return String(text || '')
    .replace(/\u2018|\u2019|\u02BC/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2022/g, '-')
    .replace(/\u2192/g, '->')
    .replace(/\u2190/g, '<-')
    .replace(/[\t\r]+/g, ' ')
    .replace(/[^\n\x20-\x7E]/g, '?');
}

/** pdf-lib throws on empty strings and missing glyphs — sanitize per font. */
function fitTextToFont(text, font) {
  const cleaned = toPdfText(text).replace(/\n/g, ' ');
  if (!cleaned) return '';

  try {
    font.encodeText(cleaned);
    return cleaned;
  } catch {
    let out = '';
    for (const ch of cleaned) {
      try {
        font.encodeText(ch);
        out += ch;
      } catch {
        out += ch === ' ' ? ' ' : '?';
      }
    }
    return out;
  }
}

function flattenInlineTokens(tokens) {
  const out = [];
  for (const token of tokens || []) {
    if (token.type === 'text' && token.tokens?.length) {
      out.push(...flattenInlineTokens(token.tokens));
    } else if (token.type === 'paragraph' && token.tokens?.length) {
      out.push(...flattenInlineTokens(token.tokens));
    } else if (token.type === 'list') {
      // handled by caller
      out.push(token);
    } else {
      out.push(token);
    }
  }
  return out;
}

/**
 * Convert Markdown source to a PDF and download it.
 */
export async function markdownToPdfAndDownload(markdown, options = {}) {
  const source = String(markdown || '').trim();
  if (!source) {
    toast.error('Add some Markdown before downloading.');
    return false;
  }

  const { filename = 'document.md', typefaceId = DEFAULT_TYPEFACE_ID } = options;

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    let fontRegular;
    let fontBold;
    let fontItalic;
    let fontBoldItalic;
    let fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

    try {
      const { bytes } = await loadTypefaceFontBytes(typefaceId);
      const embed = async (buf) => pdfDoc.embedFont(buf, { subset: true });
      fontRegular = await embed(bytes.regular);
      fontBold = await embed(bytes.bold);
      fontItalic = await embed(bytes.italic);
      fontBoldItalic = await embed(bytes.boldItalic);
    } catch (fontError) {
      console.warn('Custom typeface failed, falling back to Helvetica.', fontError);
      fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
    }

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    const contentWidth = (indent = 0) => PAGE_WIDTH - MARGIN_X * 2 - indent;

    const ensureSpace = (needed) => {
      if (y - needed < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
    };

    const drawSafeText = (text, opts) => {
      const fitted = fitTextToFont(text, opts.font);
      if (!fitted) return 0;
      page.drawText(fitted, opts);
      return opts.font.widthOfTextAtSize(fitted, opts.size);
    };

    const drawParagraph = (text, style = {}) => {
      const {
        font = fontRegular,
        size = 11,
        color = COLORS.text,
        lineHeight = size * 1.45,
        indent = 0,
        spaceAfter = 10,
      } = style;
      const lines = wrapText(text, font, size, contentWidth(indent));
      for (const line of lines) {
        ensureSpace(lineHeight);
        if (line.length > 0) {
          drawSafeText(line, {
            x: MARGIN_X + indent,
            y: y - size,
            size,
            font,
            color,
          });
        }
        y -= lineHeight;
      }
      y -= spaceAfter;
    };

    const drawInlineRuns = (tokens, baseIndent = 0) => {
      const size = 11;
      const lineHeight = size * 1.45;
      const maxW = contentWidth(baseIndent);
      let x = MARGIN_X + baseIndent;
      ensureSpace(lineHeight);

      const flushNewLine = () => {
        y -= lineHeight;
        x = MARGIN_X + baseIndent;
        ensureSpace(lineHeight);
      };

      const drawRun = (text, font, color) => {
        const parts = toPdfText(text).split(/(\s+|\n)/);
        for (const part of parts) {
          if (!part) continue;
          if (part === '\n') {
            flushNewLine();
            continue;
          }
          const fitted = fitTextToFont(part, font);
          if (!fitted) continue;
          const width = font.widthOfTextAtSize(fitted, size);
          if (x > MARGIN_X + baseIndent && x + width > MARGIN_X + baseIndent + maxW) {
            flushNewLine();
          }
          if (width > maxW) {
            const wrapped = wrapText(fitted, font, size, maxW);
            wrapped.forEach((line, i) => {
              if (i > 0) flushNewLine();
              const w = drawSafeText(line, { x, y: y - size, size, font, color });
              x += w;
            });
            continue;
          }
          drawSafeText(fitted, { x, y: y - size, size, font, color });
          x += width;
        }
      };

      const walk = (nodes, style = {}) => {
        for (const node of nodes || []) {
          if (node.type === 'text' || node.type === 'escape') {
            if (node.tokens?.length) {
              walk(node.tokens, style);
              continue;
            }
            const font =
              style.bold && style.italic
                ? fontBoldItalic
                : style.bold
                  ? fontBold
                  : style.italic
                    ? fontItalic
                    : fontRegular;
            drawRun(node.text || node.raw || '', font, style.color || COLORS.text);
          } else if (node.type === 'codespan') {
            drawRun(node.text || '', fontMono, COLORS.muted);
          } else if (node.type === 'strong') {
            walk(node.tokens, { ...style, bold: true });
          } else if (node.type === 'em') {
            walk(node.tokens, { ...style, italic: true });
          } else if (node.type === 'del') {
            walk(node.tokens, style);
          } else if (node.type === 'link') {
            walk(node.tokens?.length ? node.tokens : [{ type: 'text', text: node.text }], {
              ...style,
              color: COLORS.link,
            });
            if (node.href) drawRun(` (${node.href})`, fontRegular, COLORS.muted);
          } else if (node.type === 'image') {
            drawRun(node.text || '[image]', fontItalic, COLORS.muted);
          } else if (node.type === 'br') {
            flushNewLine();
          } else if (node.type === 'paragraph' && node.tokens) {
            walk(node.tokens, style);
          } else if (node.tokens) {
            walk(node.tokens, style);
          } else if (node.text) {
            drawRun(node.text, fontRegular, COLORS.text);
          }
        }
      };

      walk(flattenInlineTokens(tokens));
      y -= lineHeight + 8;
    };

    const renderTokens = (tokens, indent = 0) => {
      for (const token of tokens || []) {
        switch (token.type) {
          case 'space':
            y -= 6;
            break;

          case 'heading': {
            const size = headingSize(token.depth);
            y -= token.depth === 1 ? 8 : 4;
            drawParagraph(inlinePlain(token.tokens) || token.text || '', {
              font: fontBold,
              size,
              lineHeight: size * 1.3,
              indent,
              spaceAfter: token.depth <= 2 ? 12 : 8,
            });
            break;
          }

          case 'paragraph': {
            if (token.tokens?.length) drawInlineRuns(token.tokens, indent);
            else drawParagraph(token.text || '', { indent });
            break;
          }

          case 'blockquote': {
            const before = y;
            const quoteIndent = indent + 14;
            renderTokens(token.tokens || [], quoteIndent);
            const blockHeight = Math.max(before - y, 16);
            page.drawRectangle({
              x: MARGIN_X + indent,
              y: y + 4,
              width: 3,
              height: blockHeight - 4,
              color: COLORS.quoteBar,
            });
            y -= 6;
            break;
          }

          case 'list': {
            const ordered = Boolean(token.ordered);
            let index = typeof token.start === 'number' ? token.start : 1;
            for (const item of token.items || []) {
              const bullet = ordered ? `${index}.` : '-';
              const label = `${bullet} `;
              const size = 11;
              const labelWidth = fontRegular.widthOfTextAtSize(label, size);
              const itemIndent = indent + Math.max(labelWidth, 14);
              ensureSpace(size * 1.45);
              drawSafeText(label, {
                x: MARGIN_X + indent,
                y: y - size,
                size,
                font: fontRegular,
                color: COLORS.text,
              });

              const nestedLists = (item.tokens || []).filter((t) => t.type === 'list');
              const bodyTokens = flattenInlineTokens(
                (item.tokens || []).filter((t) => t.type !== 'list')
              );

              if (bodyTokens.length) {
                // Keep bullet and first line on the same baseline.
                const savedY = y;
                drawInlineRuns(bodyTokens, itemIndent);
                // drawInlineRuns advances y; if content was short that's fine.
                if (y > savedY - size * 1.45) y = savedY - size * 1.45;
              } else {
                y -= size * 1.45;
              }
              y -= 4;
              if (nestedLists.length) renderTokens(nestedLists, itemIndent);
              index += 1;
            }
            y -= 4;
            break;
          }

          case 'code': {
            const size = 9.5;
            const lineHeight = size * 1.4;
            const pad = 8;
            const lines = wrapText(
              (token.text || '').replace(/\t/g, '  '),
              fontMono,
              size,
              contentWidth(indent) - pad * 2
            );
            const blockHeight = Math.max(lines.length, 1) * lineHeight + pad * 2;
            ensureSpace(blockHeight + 8);
            page.drawRectangle({
              x: MARGIN_X + indent,
              y: y - blockHeight,
              width: contentWidth(indent),
              height: blockHeight,
              color: COLORS.codeBg,
              borderColor: COLORS.codeBorder,
              borderWidth: 0.75,
            });
            let cy = y - pad;
            for (const line of lines) {
              drawSafeText(line.length ? line : ' ', {
                x: MARGIN_X + indent + pad,
                y: cy - size,
                size,
                font: fontMono,
                color: COLORS.text,
              });
              cy -= lineHeight;
            }
            y -= blockHeight + 10;
            break;
          }

          case 'hr': {
            ensureSpace(18);
            y -= 8;
            page.drawLine({
              start: { x: MARGIN_X + indent, y },
              end: { x: MARGIN_X + indent + contentWidth(indent), y },
              thickness: 1,
              color: COLORS.hr,
            });
            y -= 12;
            break;
          }

          case 'table': {
            const header = (token.header || []).map(
              (cell) => inlinePlain(cell.tokens) || cell.text || ''
            );
            const rows = (token.rows || []).map((row) =>
              row.map((cell) => inlinePlain(cell.tokens) || cell.text || '')
            );
            const all = [header, ...rows].filter((r) => r.length);
            for (const [rowIndex, row] of all.entries()) {
              drawParagraph(row.join('  |  '), {
                font: rowIndex === 0 ? fontBold : fontRegular,
                size: 10,
                indent,
                spaceAfter: 4,
              });
            }
            y -= 6;
            break;
          }

          case 'html':
            break;

          default: {
            if (token.tokens) renderTokens(token.tokens, indent);
            else if (token.text) drawParagraph(token.text, { indent });
            break;
          }
        }
      }
    };

    renderTokens(marked.lexer(source));

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    triggerDownload(blob, `${baseName(filename)}.pdf`);
    toast.success('PDF downloaded.');
    return true;
  } catch (error) {
    console.error('Markdown to PDF error:', error);
    const detail = error?.message ? String(error.message).slice(0, 120) : '';
    toast.error(detail ? `PDF failed: ${detail}` : 'Could not convert this Markdown to PDF.');
    return false;
  }
}

export function markdownToPreviewHtml(markdown) {
  try {
    return marked.parse(String(markdown || ''), { gfm: true, breaks: false });
  } catch {
    return '<p>Could not render preview.</p>';
  }
}

export const SAMPLE_MARKDOWN = `# Markdown to PDF

Convert **Markdown** to a clean PDF in your browser.

## Features

- Upload a \`.md\` file or paste content
- Headings, lists, code, and quotes
- Download instantly — nothing is uploaded

### Example list

1. Write or paste Markdown
2. Preview the result
3. Download your PDF

> Tip: Everything runs locally on your device.

\`\`\`js
console.log('Hello from Markdown');
\`\`\`
`;
