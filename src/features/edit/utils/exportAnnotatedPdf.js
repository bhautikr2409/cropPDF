import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import toast from 'react-hot-toast';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function hexToRgb(hex) {
  const cleaned = String(hex || '#000000').replace('#', '');
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

function toPdfPoint(x, y, renderWidth, renderHeight, pdfWidth, pdfHeight) {
  return {
    x: (x / renderWidth) * pdfWidth,
    y: pdfHeight - (y / renderHeight) * pdfHeight,
  };
}

async function embedAnnotationImage(pdfDoc, dataUrl) {
  const res = await fetch(dataUrl);
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (dataUrl.startsWith('data:image/jpeg') || dataUrl.includes('image/jpeg')) {
    return pdfDoc.embedJpg(bytes);
  }
  return pdfDoc.embedPng(bytes);
}

/**
 * Bake page annotations into a PDF and download.
 * Annotations use top-left CSS coordinates relative to the rendered page size.
 *
 * @param {File} file
 * @param {Record<number, object[]>} annotationsByPage
 * @param {{ width: number, height: number }} renderSize - rendered page pixel size used while editing
 */
export async function exportAnnotatedPdf(file, annotationsByPage, renderSize) {
  if (!renderSize?.width || !renderSize?.height) {
    toast.error('PDF page is not ready yet.');
    return false;
  }

  try {
    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const pages = pdfDoc.getPages();

    const fontCache = {};
    const getFont = async (name) => {
      const key = name || 'Helvetica';
      if (!fontCache[key]) {
        const map = {
          Helvetica: StandardFonts.Helvetica,
          TimesRoman: StandardFonts.TimesRoman,
          Courier: StandardFonts.Courier,
        };
        fontCache[key] = await pdfDoc.embedFont(map[key] || StandardFonts.Helvetica);
      }
      return fontCache[key];
    };

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const pageNumber = pageIndex + 1;
      const annotations = annotationsByPage[pageNumber] || [];
      if (annotations.length === 0) continue;

      const page = pages[pageIndex];
      const { width: pdfWidth, height: pdfHeight } = page.getSize();
      const { width: renderWidth, height: renderHeight } = renderSize;

      for (const ann of annotations) {
        const color = hexToRgb(ann.color);
        const stroke = rgb(color.r, color.g, color.b);

        if (ann.type === 'text') {
          const font = await getFont(ann.fontFamily);
          const fontSize = Number(ann.fontSize) || 16;
          const start = toPdfPoint(ann.x, ann.y + fontSize, renderWidth, renderHeight, pdfWidth, pdfHeight);
          const text = String(ann.text || 'Text');
          page.drawText(text, {
            x: start.x,
            y: start.y,
            size: fontSize * (pdfWidth / renderWidth),
            font,
            color: stroke,
          });
        }

        if (ann.type === 'rect') {
          const x = (ann.x / renderWidth) * pdfWidth;
          const w = (ann.width / renderWidth) * pdfWidth;
          const h = (ann.height / renderHeight) * pdfHeight;
          const y = pdfHeight - (ann.y / renderHeight) * pdfHeight - h;
          page.drawRectangle({
            x,
            y,
            width: Math.max(1, w),
            height: Math.max(1, h),
            borderColor: stroke,
            borderWidth: Math.max(0.5, (ann.strokeWidth || 2) * (pdfWidth / renderWidth)),
            color: ann.filled ? rgb(color.r, color.g, color.b) : undefined,
            opacity: ann.filled ? 0.2 : 1,
            borderOpacity: 1,
          });
        }

        if (ann.type === 'ellipse') {
          const x = (ann.x / renderWidth) * pdfWidth;
          const w = (ann.width / renderWidth) * pdfWidth;
          const h = (ann.height / renderHeight) * pdfHeight;
          const y = pdfHeight - (ann.y / renderHeight) * pdfHeight - h;
          page.drawEllipse({
            x: x + w / 2,
            y: y + h / 2,
            xScale: Math.max(1, w / 2),
            yScale: Math.max(1, h / 2),
            borderColor: stroke,
            borderWidth: Math.max(0.5, (ann.strokeWidth || 2) * (pdfWidth / renderWidth)),
            color: ann.filled ? rgb(color.r, color.g, color.b) : undefined,
            opacity: ann.filled ? 0.2 : 1,
            borderOpacity: 1,
          });
        }

        if (ann.type === 'line') {
          const p1 = toPdfPoint(ann.x1, ann.y1, renderWidth, renderHeight, pdfWidth, pdfHeight);
          const p2 = toPdfPoint(ann.x2, ann.y2, renderWidth, renderHeight, pdfWidth, pdfHeight);
          page.drawLine({
            start: p1,
            end: p2,
            thickness: Math.max(0.5, (ann.strokeWidth || 2) * (pdfWidth / renderWidth)),
            color: stroke,
          });
        }

        if (ann.type === 'pen' && Array.isArray(ann.points) && ann.points.length > 1) {
          for (let i = 1; i < ann.points.length; i++) {
            const a = ann.points[i - 1];
            const b = ann.points[i];
            const p1 = toPdfPoint(a.x, a.y, renderWidth, renderHeight, pdfWidth, pdfHeight);
            const p2 = toPdfPoint(b.x, b.y, renderWidth, renderHeight, pdfWidth, pdfHeight);
            page.drawLine({
              start: p1,
              end: p2,
              thickness: Math.max(0.5, (ann.strokeWidth || 2) * (pdfWidth / renderWidth)),
              color: stroke,
              lineCap: 1,
            });
          }
        }

        if (ann.type === 'image' && ann.dataUrl) {
          const image = await embedAnnotationImage(pdfDoc, ann.dataUrl);
          const x = (ann.x / renderWidth) * pdfWidth;
          const w = (ann.width / renderWidth) * pdfWidth;
          const h = (ann.height / renderHeight) * pdfHeight;
          const y = pdfHeight - (ann.y / renderHeight) * pdfHeight - h;
          page.drawImage(image, {
            x,
            y,
            width: Math.max(1, w),
            height: Math.max(1, h),
          });
        }
      }
    }

    const out = await pdfDoc.save();
    const blob = new Blob([out], { type: 'application/pdf' });
    const name = file.name.replace(/\.pdf$/i, '') || 'document';
    triggerDownload(blob, `${name}-edited.pdf`);
    toast.success('Edited PDF downloaded.');
    return true;
  } catch (error) {
    console.error('Export edited PDF error:', error);
    if (String(error?.message || error).toLowerCase().includes('encrypt')) {
      toast.error('This PDF is password-protected. Unlock it first.');
    } else {
      toast.error('Failed to export edited PDF.');
    }
    return false;
  }
}
