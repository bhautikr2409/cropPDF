export const IMAGE_FORMATS = {
  png: {
    id: 'png',
    label: 'PNG',
    mime: 'image/png',
    extension: 'png',
    hint: 'Lossless — best quality, larger files',
  },
  jpeg: {
    id: 'jpeg',
    label: 'JPEG',
    mime: 'image/jpeg',
    extension: 'jpg',
    hint: 'Smaller files — good for photos/scans',
  },
};

export const RENDER_SCALES = {
  normal: { id: 'normal', label: 'Normal', scale: 1.5, hint: '~1080px wide pages' },
  high: { id: 'high', label: 'High', scale: 2, hint: 'Sharper export' },
  print: { id: 'print', label: 'Print', scale: 3, hint: 'Largest / print-ready' },
};

export function formatFileSize(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
