export const COMPRESS_LEVELS = {
  extreme: {
    id: 'extreme',
    label: 'Extreme',
    scale: 1,
    quality: 0.35,
    hint: 'Smallest size — best for sharing drafts',
  },
  recommended: {
    id: 'recommended',
    label: 'Recommended',
    scale: 1.5,
    quality: 0.55,
    hint: 'Balanced size and readability',
  },
  high: {
    id: 'high',
    label: 'High quality',
    scale: 2,
    quality: 0.75,
    hint: 'Sharper pages — larger output',
  },
};

export function formatFileSize(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function compressionPercent(original, compressed) {
  if (!original || !compressed) return null;
  const saved = ((original - compressed) / original) * 100;
  return Math.round(saved);
}
