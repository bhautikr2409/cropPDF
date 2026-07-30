import '../../../lib/pdf/worker';
import { pdfjs } from 'react-pdf';

/** Near-white threshold (0–255). */
const WHITE_THRESHOLD = 245;
/** Dark pixel for border lines. */
const DARK_THRESHOLD = 90;
/** Rows with ink ratio below this are treated as empty (gap). */
const EMPTY_ROW_INK = 0.018;
/** Minimum gap height as fraction of page height to split label/invoice. */
const MIN_GAP_FRAC = 0.02;

/**
 * Platform presets: fractions of page (top-left origin, like canvas).
 * Flipkart label box is typically the upper ~42–46% inside a black border.
 */
export const LABEL_PLATFORMS = {
  auto: {
    id: 'auto',
    label: 'Auto detect',
    hint: 'Find the shipping label automatically',
  },
  flipkart: {
    id: 'flipkart',
    label: 'Flipkart',
    hint: 'Crops TOP shipping label only (tight to black border)',
    // Centered label box on A4 (~4×6 proportion)
    preset: { x: 0.22, y: 0, w: 0.56, h: 0.48 },
  },
  meesho: {
    id: 'meesho',
    label: 'Meesho',
    hint: 'Supplier Panel A4 label + invoice',
    preset: { x: 0.03, y: 0.02, w: 0.94, h: 0.44 },
  },
};

/** Output sizes in PDF points (72 pt = 1 inch). */
export const OUTPUT_SIZES = {
  '4x6': {
    id: '4x6',
    label: '4×6 inch (thermal)',
    hint: '100 × 150 mm — most thermal printers',
    widthPt: 4 * 72,
    heightPt: 6 * 72,
  },
  '4x5': {
    id: '4x5',
    label: '4×5 inch',
    hint: '100 × 127 mm thermal labels',
    widthPt: 4 * 72,
    heightPt: 5 * 72,
  },
  original: {
    id: 'original',
    label: 'Cropped only',
    hint: 'Keep label aspect — no resize',
    widthPt: null,
    heightPt: null,
  },
};

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isInk(r, g, b, a) {
  if (a < 20) return false;
  return r < WHITE_THRESHOLD || g < WHITE_THRESHOLD || b < WHITE_THRESHOLD;
}

function isDark(r, g, b, a) {
  if (a < 20) return false;
  return r < DARK_THRESHOLD && g < DARK_THRESHOLD && b < DARK_THRESHOLD;
}

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

function boxFromPixels(minX, minY, maxX, maxY, width, height, pad = 0) {
  const x0 = Math.max(0, minX - pad);
  const y0 = Math.max(0, minY - pad);
  const x1 = Math.min(width - 1, maxX + pad);
  const y1 = Math.min(height - 1, maxY + pad);
  return {
    x: clamp01(x0 / width),
    y: clamp01(y0 / height),
    w: clamp01((x1 - x0 + 1) / width),
    h: clamp01((y1 - y0 + 1) / height),
  };
}

/**
 * Find non-white content bounds on a canvas ImageData (top-left origin).
 */
export function findContentBounds(imageData, width, height) {
  const { data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  // Sample every 2px for speed on large pages
  const step = width * height > 1_200_000 ? 2 : 1;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      if (isInk(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) return null;
  const pad = Math.max(2, Math.round(Math.min(width, height) * 0.004));
  return {
    minX: Math.max(0, minX - pad),
    minY: Math.max(0, minY - pad),
    maxX: Math.min(width - 1, maxX + pad),
    maxY: Math.min(height - 1, maxY + pad),
  };
}

/**
 * Score each row for "solid horizontal rule" (Flipkart label border).
 */
function horizontalLineScores(imageData, width, height) {
  const { data } = imageData;
  const scores = new Float32Array(height);
  const xStart = Math.floor(width * 0.06);
  const xEnd = Math.floor(width * 0.94);
  const span = Math.max(1, xEnd - xStart);

  for (let y = 0; y < height; y++) {
    let dark = 0;
    for (let x = xStart; x < xEnd; x++) {
      const i = (y * width + x) * 4;
      if (isDark(data[i], data[i + 1], data[i + 2], data[i + 3])) dark += 1;
    }
    scores[y] = dark / span;
  }
  return scores;
}

/**
 * Score each column for solid vertical rule.
 */
function verticalLineScores(imageData, width, height, y0, y1) {
  const { data } = imageData;
  const scores = new Float32Array(width);
  const span = Math.max(1, y1 - y0);

  for (let x = 0; x < width; x++) {
    let dark = 0;
    for (let y = y0; y <= y1; y++) {
      const i = (y * width + x) * 4;
      if (isDark(data[i], data[i + 1], data[i + 2], data[i + 3])) dark += 1;
    }
    scores[x] = dark / span;
  }
  return scores;
}

/**
 * Detect Flipkart-style shipping label outer black border rectangle.
 * @returns {{ minX, minY, maxX, maxY } | null} in pixel coords (top-left)
 */
export function findLabelBorderBox(imageData, width, height) {
  const hScores = horizontalLineScores(imageData, width, height);
  const lineThreshold = 0.5;
  const searchBottom = Math.floor(height * 0.62);

  // Cluster consecutive high-score rows into line bands; take band center
  const bands = [];
  let y = 0;
  while (y < searchBottom) {
    if (hScores[y] < lineThreshold) {
      y += 1;
      continue;
    }
    const start = y;
    let peak = hScores[y];
    let peakY = y;
    while (y < searchBottom && hScores[y] >= lineThreshold * 0.85) {
      if (hScores[y] > peak) {
        peak = hScores[y];
        peakY = y;
      }
      y += 1;
    }
    if (y - start >= 1 && peak >= lineThreshold) {
      bands.push({ y: peakY, score: peak, thickness: y - start });
    }
  }

  if (bands.length < 2) return null;

  // Top border = first strong band near the top
  const topBand = bands[0];
  if (topBand.y > height * 0.12) return null;

  // Bottom border of label = last strong band still in upper ~55% of page,
  // and meaningfully below the top (label has height).
  let bottomBand = null;
  for (let i = bands.length - 1; i >= 1; i--) {
    const b = bands[i];
    if (b.y < height * 0.55 && b.y > topBand.y + height * 0.22) {
      bottomBand = b;
      break;
    }
  }
  // Prefer a band near ~35–48% of page height (typical Flipkart label bottom)
  if (!bottomBand) {
    let best = null;
    for (const b of bands.slice(1)) {
      if (b.y <= topBand.y + height * 0.2 || b.y > height * 0.55) continue;
      const ideal = height * 0.42;
      const score = b.score - Math.abs(b.y - ideal) / height;
      if (!best || score > best.score) best = { ...b, score };
    }
    bottomBand = best;
  }

  if (!bottomBand) return null;

  const y0 = topBand.y;
  const y1 = bottomBand.y;
  const vScores = verticalLineScores(imageData, width, height, y0, y1);
  const vThreshold = 0.35;

  const leftCandidates = [];
  for (let x = Math.floor(width * 0.05); x < width * 0.55; x++) {
    if (vScores[x] >= vThreshold) leftCandidates.push(x);
  }
  const rightCandidates = [];
  for (let x = Math.floor(width * 0.95); x > width * 0.45; x--) {
    if (vScores[x] >= vThreshold) rightCandidates.push(x);
  }

  let leftX = null;
  let rightX = null;
  let bestScore = -Infinity;
  for (const lx of leftCandidates) {
    for (const rx of rightCandidates) {
      if (rx <= lx) continue;
      const wFrac = (rx - lx) / width;
      if (wFrac < 0.28 || wFrac > 0.72) continue;
      const centerFrac = (lx + rx) / 2 / width;
      const centerPenalty = Math.abs(centerFrac - 0.5) * 0.6;
      const widthPenalty = Math.abs(wFrac - 0.52) * 0.9;
      const score = vScores[lx] + vScores[rx] - centerPenalty - widthPenalty;
      if (score > bestScore) {
        bestScore = score;
        leftX = lx;
        rightX = rx;
      }
    }
  }

  if (leftX == null || rightX == null) return null;

  // Include the border stroke itself
  const pad = Math.max(1, Math.round(Math.min(width, height) * 0.002));
  return {
    minX: Math.max(0, leftX - pad),
    minY: Math.max(0, y0 - pad),
    maxX: Math.min(width - 1, rightX + pad),
    maxY: Math.min(height - 1, y1 + pad),
  };
}

/**
 * Find a horizontal white/near-empty gap that separates shipping label from invoice.
 * Also treats sparse dashed cut-lines as split markers.
 */
export function findLabelInvoiceSplit(imageData, width, height, bounds) {
  const { data } = imageData;
  const top = bounds?.minY ?? 0;
  const bottom = bounds?.maxY ?? height - 1;
  const left = bounds?.minX ?? Math.floor(width * 0.05);
  const right = bounds?.maxX ?? Math.floor(width * 0.95);
  const contentH = bottom - top + 1;
  if (contentH < 40) return null;

  const rowInk = new Float32Array(height);
  const span = Math.max(1, right - left + 1);

  for (let y = top; y <= bottom; y++) {
    let ink = 0;
    for (let x = left; x <= right; x++) {
      const i = (y * width + x) * 4;
      if (isInk(data[i], data[i + 1], data[i + 2], data[i + 3])) ink += 1;
    }
    rowInk[y] = ink / span;
  }

  // Look for dashed cut line: moderate ink in a narrow band with gaps (not solid table row)
  const searchStart = top + Math.floor(contentH * 0.3);
  const searchEnd = top + Math.floor(contentH * 0.72);
  const minGap = Math.max(4, Math.floor(height * MIN_GAP_FRAC));

  let bestGap = null;
  let y = searchStart;
  while (y <= searchEnd) {
    // Empty or dashed (ink between 0 and ~0.25)
    if (rowInk[y] > 0.28) {
      y += 1;
      continue;
    }
    const gapStart = y;
    while (y <= searchEnd && rowInk[y] <= 0.28) y += 1;
    const gapEnd = y - 1;
    const gapH = gapEnd - gapStart + 1;
    if (gapH >= minGap) {
      const mid = (gapStart + gapEnd) / 2;
      // Prefer gaps around 40–50% of page (Flipkart cut line)
      const ideal = height * 0.45;
      const score = gapH * 2 - Math.abs(mid - ideal) * 0.05;
      if (!bestGap || score > bestGap.score) {
        bestGap = { gapStart, gapEnd, score };
      }
    }
  }

  if (!bestGap) return null;
  return Math.max(top + 20, bestGap.gapStart - 1);
}

/**
 * Use PDF text layer to find "Tax Invoice" (Flipkart) — highly reliable split.
 * Returns ratio box in top-left page fractions, or null.
 */
export async function detectFlipkartLabelFromText(page) {
  try {
    const viewport = page.getViewport({ scale: 1 });
    const pageH = viewport.height;
    const content = await page.getTextContent({ disableCombineTextItems: false });

    let taxInvoiceTop = null; // top-left coords
    let notForResaleBottom = null; // top-left coords
    let shippingTop = null;
    let shippingBottom = null;
    let orderedTop = null;
    let awbTop = null;
    let awbBottom = null;

    for (const item of content.items || []) {
      const str = String(item.str || '').trim();
      if (!str) continue;
      const tx = item.transform || [];
      const y = tx[5] ?? 0; // PDF bottom-left
      const h = Math.max(8, Number(item.height || 8));
      const topFromTop = pageH - y;
      const bottomFromTop = topFromTop + h;

      if (/^tax\s*invoice$/i.test(str) || /^taxinvoice$/i.test(str.replace(/\s+/g, ''))) {
        if (taxInvoiceTop == null || topFromTop < taxInvoiceTop) {
          taxInvoiceTop = topFromTop;
        }
      }
      if (/not for resale/i.test(str)) {
        if (notForResaleBottom == null || bottomFromTop > notForResaleBottom) {
          notForResaleBottom = bottomFromTop;
        }
      }

      if (/shipping\s*\/\s*customer\s*address/i.test(str)) {
        if (shippingTop == null || topFromTop < shippingTop) shippingTop = topFromTop;
        if (shippingBottom == null || bottomFromTop > shippingBottom) shippingBottom = bottomFromTop;
      }
      if (/ordered\s*through/i.test(str)) {
        if (orderedTop == null || topFromTop < orderedTop) orderedTop = topFromTop;
      }
      if (/awb/i.test(str)) {
        if (awbTop == null || topFromTop < awbTop) awbTop = topFromTop;
        if (awbBottom == null || bottomFromTop > awbBottom) awbBottom = bottomFromTop;
      }
    }

    // Strong Flipkart signal: ordered/awb/shipping + tax invoice separator.
    if (
      taxInvoiceTop != null &&
      taxInvoiceTop > pageH * 0.22 &&
      taxInvoiceTop < pageH * 0.72 &&
      (orderedTop != null || awbTop != null || shippingTop != null)
    ) {
      const topAnchor = [orderedTop, awbTop, shippingTop]
        .filter((v) => typeof v === 'number')
        .reduce((a, b) => Math.min(a, b), pageH * 0.03);
      const top = Math.max(pageH * 0.006, topAnchor - pageH * 0.06);
      const bottom = Math.max(top + pageH * 0.22, taxInvoiceTop - pageH * 0.014);
      const h = (bottom - top) / pageH;
      if (h > 0.2 && h < 0.58) {
        return {
          x: 0.028,
          y: top / pageH,
          w: 0.944,
          h,
          source: 'tax-invoice-text',
        };
      }
    }

    // Secondary signal: explicit "Not for resale." near label bottom.
    if (
      notForResaleBottom != null &&
      notForResaleBottom > pageH * 0.2 &&
      notForResaleBottom < pageH * 0.62 &&
      (orderedTop != null || awbTop != null || shippingTop != null)
    ) {
      const topAnchor = [orderedTop, awbTop, shippingTop]
        .filter((v) => typeof v === 'number')
        .reduce((a, b) => Math.min(a, b), pageH * 0.03);
      const top = Math.max(pageH * 0.006, topAnchor - pageH * 0.06);
      const bottom = Math.min(pageH * 0.6, notForResaleBottom + pageH * 0.01);
      const h = (bottom - top) / pageH;
      if (h > 0.2 && h < 0.58) {
        return {
          x: 0.028,
          y: top / pageH,
          w: 0.944,
          h,
          source: 'not-for-resale-text',
        };
      }
    }

    // Last-resort text-only Flipkart estimate.
    if (orderedTop != null || shippingTop != null) {
      const topAnchor = [orderedTop, awbTop, shippingTop]
        .filter((v) => typeof v === 'number')
        .reduce((a, b) => Math.min(a, b), pageH * 0.03);
      const lowerAnchor = [shippingBottom, awbBottom, notForResaleBottom]
        .filter((v) => typeof v === 'number')
        .reduce((a, b) => Math.max(a, b), pageH * 0.36);
      const top = Math.max(pageH * 0.006, topAnchor - pageH * 0.06);
      const bottom = Math.min(pageH * 0.58, Math.max(lowerAnchor + pageH * 0.035, top + pageH * 0.26));
      const h = (bottom - top) / pageH;
      if (h > 0.2 && h < 0.58) {
        return {
          x: 0.028,
          y: top / pageH,
          w: 0.944,
          h,
          source: 'flipkart-anchor-text',
        };
      }
    }
  } catch (error) {
    console.warn('Text-based label detect failed', error);
  }
  return null;
}

/**
 * Detect label crop box as fractions of the page (top-left origin).
 * @returns {{ x:number, y:number, w:number, h:number }}
 */
export function detectLabelRatios(imageData, width, height, platformId = 'auto') {
  const platform = LABEL_PLATFORMS[platformId] || LABEL_PLATFORMS.auto;
  const preferBorder =
    platformId === 'flipkart' || platformId === 'auto' || platformId === 'meesho';

  // 1) Prefer outer black border of shipping label (Flipkart)
  if (preferBorder) {
    const border = findLabelBorderBox(imageData, width, height);
    if (border) {
      const hFrac = (border.maxY - border.minY) / height;
      const wFrac = (border.maxX - border.minX) / width;
      // Sanity: label should be wide and roughly upper-half height
      if (
        wFrac > 0.28 &&
        wFrac < 0.75 &&
        hFrac > 0.24 &&
        hFrac < 0.62 &&
        border.minY < height * 0.14
      ) {
        return boxFromPixels(
          border.minX,
          border.minY,
          border.maxX,
          border.maxY,
          width,
          height,
          1
        );
      }
    }
  }

  const bounds = findContentBounds(imageData, width, height);
  if (!bounds) {
    return platform.preset || { x: 0.03, y: 0.02, w: 0.94, h: 0.43 };
  }

  // 2) Split on dashed cut / white gap above invoice
  let labelBottom = bounds.maxY;
  const splitY = findLabelInvoiceSplit(imageData, width, height, bounds);
  if (splitY != null && splitY > bounds.minY + height * 0.22) {
    labelBottom = splitY;
  } else if (bounds.maxY - bounds.minY > height * 0.65) {
    // Tall page without clear gap — take upper band (Flipkart-like)
    const presetH = platform.preset?.h ?? 0.43;
    labelBottom = Math.min(
      bounds.maxY,
      Math.round((platform.preset?.y ?? 0.02) * height + presetH * height)
    );
  }

  // Keep left/right close to content but not full invoice width quirks
  let minX = bounds.minX;
  let maxX = bounds.maxX;
  if (platform.preset) {
    minX = Math.max(minX, Math.round(platform.preset.x * width));
    maxX = Math.min(maxX, Math.round((platform.preset.x + platform.preset.w) * width));
  }

  return boxFromPixels(minX, bounds.minY, maxX, labelBottom, width, height, 2);
}

/**
 * Full detection pipeline for one page (text first, then raster).
 */
export async function detectPageLabelRatios(pdfPage, imageData, width, height, platformId) {
  if (platformId === 'flipkart' || platformId === 'auto') {
    const fromText = await detectFlipkartLabelFromText(pdfPage);
    if (fromText) {
      // Refine left/right with border if possible
      const border = findLabelBorderBox(imageData, width, height);
      if (border && border.minY < height * 0.12) {
        const textBottom = (fromText.y + fromText.h) * height;
        const borderBottom = border.maxY;
        // Use border if it's close to text-based bottom
        if (Math.abs(borderBottom - textBottom) < height * 0.08) {
          return boxFromPixels(
            border.minX,
            border.minY,
            border.maxX,
            Math.max(borderBottom, textBottom - height * 0.01),
            width,
            height,
            1
          );
        }
      }
      return {
        x: fromText.x,
        y: fromText.y,
        w: fromText.w,
        h: fromText.h,
      };
    }
  }

  return detectLabelRatios(imageData, width, height, platformId);
}

/**
 * Render one PDF page to ImageData for detection.
 */
export async function renderPageImageData(pdf, pageNumber, scale = 2, keepCanvas = false) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const result = {
    imageData,
    width: canvas.width,
    height: canvas.height,
    page,
    canvas: keepCanvas ? canvas : null,
  };
  if (!keepCanvas) {
    canvas.width = 0;
    canvas.height = 0;
  }
  return result;
}

export async function loadPdfDocument(file) {
  const bytes = await file.arrayBuffer();
  return pdfjs.getDocument({ data: bytes.slice(0) }).promise;
}

/**
 * Convert top-left ratio crop to pdf-lib crop box (bottom-left origin).
 */
export function ratiosToPdfBox(ratios, pageWidth, pageHeight) {
  const pdfW = Math.max(1, ratios.w * pageWidth);
  const pdfH = Math.max(1, ratios.h * pageHeight);
  const pdfX = ratios.x * pageWidth;
  const pdfY = pageHeight - (ratios.y * pageHeight + pdfH);
  return {
    pdfX: Math.max(0, pdfX),
    pdfY: Math.max(0, pdfY),
    pdfW: Math.min(pdfW, pageWidth),
    pdfH: Math.min(pdfH, pageHeight),
  };
}
