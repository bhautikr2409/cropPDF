export const PAGE_BREAK_MODES = {
  HEADING: {
    id: 'heading',
    label: 'Page headings',
    hint: 'Insert ## Page N before each page',
  },
  RULE: {
    id: 'rule',
    label: 'Horizontal rules',
    hint: 'Separate pages with ---',
  },
  NONE: {
    id: 'none',
    label: 'Continuous',
    hint: 'Merge pages without separators',
  },
};

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function baseName(fileName) {
  return String(fileName || 'document').replace(/\.pdf$/i, '') || 'document';
}
