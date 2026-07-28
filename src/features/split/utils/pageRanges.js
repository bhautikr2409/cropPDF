/**
 * Parse a page-range string like "1-3, 5, 8-10" into a sorted unique
 * list of 1-based page numbers within [1, pageCount].
 * @returns {{ pages: number[], error?: string }}
 */
export function parsePageSelection(input, pageCount) {
  const raw = String(input || '').trim();
  if (!raw) {
    return { pages: [], error: 'Enter page numbers or ranges (e.g. 1-3, 5, 8-10).' };
  }

  const pages = new Set();
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      const n = Number(part);
      if (n < 1 || n > pageCount) {
        return { pages: [], error: `Page ${n} is out of range (1–${pageCount}).` };
      }
      pages.add(n);
      continue;
    }

    const match = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!match) {
      return { pages: [], error: `Invalid range "${part}". Use formats like 5 or 2-6.` };
    }

    let start = Number(match[1]);
    let end = Number(match[2]);
    if (start > end) [start, end] = [end, start];

    if (start < 1 || end > pageCount) {
      return { pages: [], error: `Range ${start}-${end} is out of range (1–${pageCount}).` };
    }

    for (let i = start; i <= end; i++) pages.add(i);
  }

  return { pages: [...pages].sort((a, b) => a - b) };
}

/**
 * Parse ranges for split-by-range mode.
 * Each comma-separated segment becomes its own output PDF.
 * @returns {{ ranges: number[][], error?: string }}
 */
export function parseRangeGroups(input, pageCount) {
  const raw = String(input || '').trim();
  if (!raw) {
    return { ranges: [], error: 'Enter ranges separated by commas (e.g. 1-3, 4-6, 7).' };
  }

  const ranges = [];
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    let pages = [];

    if (/^\d+$/.test(part)) {
      const n = Number(part);
      if (n < 1 || n > pageCount) {
        return { ranges: [], error: `Page ${n} is out of range (1–${pageCount}).` };
      }
      pages = [n];
    } else {
      const match = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (!match) {
        return { ranges: [], error: `Invalid range "${part}". Use formats like 5 or 2-6.` };
      }
      let start = Number(match[1]);
      let end = Number(match[2]);
      if (start > end) [start, end] = [end, start];
      if (start < 1 || end > pageCount) {
        return { ranges: [], error: `Range ${start}-${end} is out of range (1–${pageCount}).` };
      }
      for (let i = start; i <= end; i++) pages.push(i);
    }

    ranges.push(pages);
  }

  return { ranges };
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
