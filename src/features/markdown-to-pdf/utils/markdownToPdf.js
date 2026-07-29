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
  tableHeaderBg: rgb(0.945, 0.953, 0.961),
  tableStripeBg: rgb(0.965, 0.973, 0.98),
  tableRule: rgb(0.86, 0.89, 0.93),
  tableCodeBg: rgb(0.93, 0.94, 0.96),
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
      out.push(token);
    } else {
      out.push(token);
    }
  }
  return out;
}

/** Build draw segments for a markdown table cell (text / inline code). */
function getCellSegments(cell) {
  const tokens = flattenInlineTokens(cell?.tokens || []);
  if (!tokens.length) {
    const text = String(cell?.text || '').trim();
    return text ? [{ kind: 'text', text, bold: false }] : [];
  }

  const segments = [];
  for (const token of tokens) {
    if (token.type === 'codespan') {
      segments.push({ kind: 'code', text: token.text || '', bold: false });
    } else if (token.type === 'strong') {
      segments.push({
        kind: 'text',
        text: inlinePlain(token.tokens) || token.text || '',
        bold: true,
      });
    } else if (token.type === 'em') {
      segments.push({
        kind: 'text',
        text: inlinePlain(token.tokens) || token.text || '',
        bold: false,
      });
    } else if (token.type === 'text' || token.type === 'escape') {
      const text = token.text || token.raw || '';
      if (text) segments.push({ kind: 'text', text, bold: false });
    } else if (token.text || token.tokens) {
      const text = inlinePlain([token]) || token.text || '';
      if (text) segments.push({ kind: 'text', text, bold: false });
    }
  }
  return segments.filter((s) => s.text);
}

function layoutSegmentLines(segments, fonts, size, maxWidth) {
  const lines = [];
  let line = [];
  let lineWidth = 0;

  const flush = () => {
    if (line.length) lines.push(line);
    line = [];
    lineWidth = 0;
  };

  const fontFor = (seg) => {
    if (seg.kind === 'code') return fonts.mono;
    if (seg.bold) return fonts.bold;
    return fonts.regular;
  };

  const pushToken = (seg, text, font) => {
    let remaining = text;
    while (remaining.length) {
      const width = font.widthOfTextAtSize(remaining, size);
      if (lineWidth === 0 && width > maxWidth) {
        let cut = remaining.length;
        while (cut > 1 && font.widthOfTextAtSize(remaining.slice(0, cut), size) > maxWidth) {
          cut -= 1;
        }
        const chunk = remaining.slice(0, cut);
        const chunkWidth = font.widthOfTextAtSize(chunk, size);
        line.push({ ...seg, text: chunk, font, width: chunkWidth });
        lineWidth += chunkWidth;
        remaining = remaining.slice(cut);
        flush();
        continue;
      }
      if (lineWidth + width <= maxWidth) {
        line.push({ ...seg, text: remaining, font, width });
        lineWidth += width;
        remaining = '';
      } else {
        flush();
      }
    }
  };

  for (const seg of segments) {
    const font = fontFor(seg);
    const parts = String(seg.text || '').split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      const fitted = fitTextToFont(part, font);
      if (!fitted) continue;
      pushToken(seg, fitted, font);
    }
  }
  flush();
  return lines.length ? lines : [[]];
}

function computeColumnWidths(columnCount, tableWidth, weightHints = []) {
  if (columnCount <= 0) return [];
  const min = Math.min(48, tableWidth / columnCount);
  const weights = Array.from({ length: columnCount }, (_, i) =>
    Math.max(1, weightHints[i] || 1)
  );
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((w) => Math.max(min, (tableWidth * w) / weightSum));
  const total = widths.reduce((a, b) => a + b, 0);
  const scale = tableWidth / total;
  return widths.map((w) => w * scale);
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
            const size = 11;
            const lineHeight = size * 1.45;
            const items = token.items || [];
            const lastIndex = index + Math.max(items.length, 1) - 1;
            const markerSlot = ordered
              ? fontRegular.widthOfTextAtSize(`${lastIndex}. `, size)
              : fontRegular.widthOfTextAtSize('- ', size);
            const bodyWidth = Math.max(24, contentWidth(indent) - markerSlot);

            for (const item of items) {
              const marker = ordered ? `${index}. ` : '- ';
              const nestedLists = (item.tokens || []).filter((t) => t.type === 'list');
              const bodyTokens = flattenInlineTokens(
                (item.tokens || []).filter((t) => t.type !== 'list')
              );
              const segments = [];
              for (const node of bodyTokens) {
                if (node.type === 'codespan') {
                  segments.push({ kind: 'code', text: node.text || '', bold: false });
                } else if (node.type === 'strong') {
                  segments.push({
                    kind: 'text',
                    text: inlinePlain(node.tokens) || node.text || '',
                    bold: true,
                  });
                } else if (node.type === 'em') {
                  segments.push({
                    kind: 'text',
                    text: inlinePlain(node.tokens) || node.text || '',
                    bold: false,
                  });
                } else if (node.type === 'text' || node.type === 'escape') {
                  segments.push({
                    kind: 'text',
                    text: node.text || node.raw || '',
                    bold: false,
                  });
                } else if (node.tokens || node.text) {
                  segments.push({
                    kind: 'text',
                    text: inlinePlain([node]) || node.text || '',
                    bold: false,
                  });
                }
              }
              if (!segments.length) {
                segments.push({
                  kind: 'text',
                  text: item.text || '',
                  bold: false,
                });
              }

              const lines = layoutSegmentLines(
                segments.filter((s) => s.text),
                { regular: fontRegular, bold: fontBold, mono: fontMono },
                size,
                bodyWidth
              );
              const blockHeight = Math.max(1, lines.length) * lineHeight;

              ensureSpace(blockHeight + 4);

              // Marker (1. / 2. / -)
              drawSafeText(marker, {
                x: MARGIN_X + indent,
                y: y - size,
                size,
                font: fontRegular,
                color: COLORS.text,
              });

              // Body lines aligned with marker baseline
              let textY = y - size;
              const textX0 = MARGIN_X + indent + markerSlot;
              for (const lineSegs of lines) {
                let textX = textX0;
                for (const seg of lineSegs) {
                  if (seg.kind === 'code') {
                    const bgPadX = 2;
                    const bgPadY = 1.2;
                    page.drawRectangle({
                      x: textX - bgPadX,
                      y: textY - bgPadY,
                      width: seg.width + bgPadX * 2,
                      height: size + bgPadY * 2,
                      color: COLORS.tableCodeBg,
                    });
                  }
                  drawSafeText(seg.text, {
                    x: textX,
                    y: textY,
                    size,
                    font: seg.font,
                    color: COLORS.text,
                  });
                  textX += seg.width;
                }
                textY -= lineHeight;
              }

              y -= blockHeight + 5;
              if (nestedLists.length) {
                renderTokens(nestedLists, indent + markerSlot);
              }
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
            const padX = 7;
            const padY = 8;
            const size = 9;
            const lineHeight = size * 1.35;
            const tableWidth = contentWidth(indent);
            const tableX = MARGIN_X + indent;

            const headerCells = token.header || [];
            const bodyRows = token.rows || [];
            const colCount = Math.max(
              headerCells.length,
              ...bodyRows.map((r) => r.length),
              1
            );

            const fonts = {
              regular: fontRegular,
              bold: fontBold,
              mono: fontMono,
            };

            const headerSegs = Array.from({ length: colCount }, (_, i) =>
              getCellSegments(headerCells[i] || { text: '' })
            );
            const bodySegs = bodyRows.map((row) =>
              Array.from({ length: colCount }, (_, i) => getCellSegments(row[i] || { text: '' }))
            );

            // Weight columns by longest plain text length (code columns get a bit more room).
            const weightHints = Array.from({ length: colCount }, (_, i) => {
              const samples = [
                headerSegs[i],
                ...bodySegs.map((r) => r[i]),
              ];
              let score = 1;
              for (const segs of samples) {
                const plain = segs.map((s) => s.text).join('');
                const codeBonus = segs.some((s) => s.kind === 'code') ? 1.25 : 1;
                score = Math.max(score, plain.length * codeBonus);
              }
              return Math.min(40, Math.max(4, score));
            });

            const colWidths = computeColumnWidths(colCount, tableWidth, weightHints);
            const colInnerWidths = colWidths.map((w) => Math.max(12, w - padX * 2));

            const layoutRow = (cellSegs, header = false) =>
              cellSegs.map((segs, i) => {
                const useFonts = header
                  ? { ...fonts, regular: fontBold, bold: fontBold }
                  : fonts;
                // Header cells are bold text by default
                const normalized = header
                  ? segs.map((s) =>
                      s.kind === 'code' ? s : { ...s, bold: true, kind: 'text' }
                    )
                  : segs;
                return layoutSegmentLines(
                  normalized.length ? normalized : [{ kind: 'text', text: ' ', bold: header }],
                  useFonts,
                  size,
                  colInnerWidths[i]
                );
              });

            const headerLines = layoutRow(headerSegs, true);
            const bodyLayouts = bodySegs.map((row) => layoutRow(row, false));

            const rowHeight = (cellLines) => {
              const maxLines = Math.max(1, ...cellLines.map((c) => c.length || 1));
              return maxLines * lineHeight + padY * 2;
            };

            const drawRow = (cellLines, opts) => {
              const { isHeader = false, striped = false } = opts;
              const height = rowHeight(cellLines);

              if (y - height < MARGIN_BOTTOM) {
                page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
                y = PAGE_HEIGHT - MARGIN_TOP;
              }

              const top = y;
              const bottom = y - height;

              if (isHeader) {
                page.drawRectangle({
                  x: tableX,
                  y: bottom,
                  width: tableWidth,
                  height,
                  color: COLORS.tableHeaderBg,
                });
              } else if (striped) {
                page.drawRectangle({
                  x: tableX,
                  y: bottom,
                  width: tableWidth,
                  height,
                  color: COLORS.tableStripeBg,
                });
              }

              // Vertical column rules
              let ruleX = tableX;
              for (let i = 0; i < colCount - 1; i++) {
                ruleX += colWidths[i];
                page.drawLine({
                  start: { x: ruleX, y: top },
                  end: { x: ruleX, y: bottom },
                  thickness: 0.6,
                  color: COLORS.tableRule,
                });
              }

              // Cell text
              let cellX = tableX;
              for (let c = 0; c < colCount; c++) {
                const lines = cellLines[c] || [[]];
                let textY = top - padY - size;
                for (const lineSegs of lines) {
                  let textX = cellX + padX;
                  for (const seg of lineSegs) {
                    if (seg.kind === 'code') {
                      const bgPadX = 2.5;
                      const bgPadY = 1.5;
                      page.drawRectangle({
                        x: textX - bgPadX,
                        y: textY - bgPadY,
                        width: seg.width + bgPadX * 2,
                        height: size + bgPadY * 2,
                        color: COLORS.tableCodeBg,
                      });
                    }
                    drawSafeText(seg.text, {
                      x: textX,
                      y: textY,
                      size,
                      font: seg.font,
                      color: COLORS.text,
                    });
                    textX += seg.width;
                  }
                  textY -= lineHeight;
                }
                cellX += colWidths[c];
              }

              if (isHeader) {
                page.drawLine({
                  start: { x: tableX, y: bottom },
                  end: { x: tableX + tableWidth, y: bottom },
                  thickness: 0.9,
                  color: COLORS.tableRule,
                });
              }

              y = bottom;
            };

            y -= 4;
            drawRow(headerLines, { isHeader: true });
            bodyLayouts.forEach((rowLines, index) => {
              drawRow(rowLines, { striped: index % 2 === 1 });
            });
            y -= 12;
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
- Headings, lists, code, quotes, and tables
- Download instantly — nothing is uploaded

### Example table

| Limiter | Max requests | Time window | Default window | Applied on |
| --- | --- | --- | --- | --- |
| Global | 300 | 15 minutes (900000 ms) | \`RATE_LIMIT_WINDOW_MS\` / \`RATE_LIMIT_MAX\` | All API requests |
| Auth | 30 | 15 minutes (900000 ms) | \`AUTH_RATE_LIMIT_WINDOW_MS\` / \`AUTH_RATE_LIMIT_MAX\` | Authentication routes |
| Public | 100 | 15 minutes (900000 ms) | \`PUBLIC_RATE_LIMIT_WINDOW_MS\` / \`PUBLIC_RATE_LIMIT_MAX\` | Public / unauthenticated routes |

> Tip: Everything runs locally on your device.

\`\`\`js
console.log('Hello from Markdown');
\`\`\`
`;
