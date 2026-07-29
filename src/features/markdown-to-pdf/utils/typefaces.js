/**
 * Typeface catalog for Markdown → PDF.
 * Font files are loaded from jsDelivr Fontsource for embedding with pdf-lib.
 */

export const TYPEFACE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'sans', label: 'Sans' },
  { id: 'serif', label: 'Serif' },
  { id: 'mono', label: 'Mono' },
];

const fontUrl = (id, weight, style = 'normal') =>
  `https://cdn.jsdelivr.net/npm/@fontsource/${id}@5.2.5/files/${id}-latin-${weight}-${style}.woff`;

export const TYPEFACES = [
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'sans',
    description: 'Familiar README look',
    cssFamily: '"Roboto", system-ui, sans-serif',
    files: {
      regular: fontUrl('roboto', 400),
      bold: fontUrl('roboto', 700),
      italic: fontUrl('roboto', 400, 'italic'),
      boldItalic: fontUrl('roboto', 700, 'italic'),
    },
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'sans',
    description: 'Sans-serif for business docs',
    cssFamily: '"Montserrat", system-ui, sans-serif',
    files: {
      regular: fontUrl('montserrat', 400),
      bold: fontUrl('montserrat', 700),
      italic: fontUrl('montserrat', 400, 'italic'),
      boldItalic: fontUrl('montserrat', 700, 'italic'),
    },
  },
  {
    id: 'lato',
    name: 'Lato',
    category: 'sans',
    description: 'Friendly neutral sans',
    cssFamily: '"Lato", system-ui, sans-serif',
    files: {
      regular: fontUrl('lato', 400),
      bold: fontUrl('lato', 700),
      italic: fontUrl('lato', 400, 'italic'),
      boldItalic: fontUrl('lato', 700, 'italic'),
    },
  },
  {
    id: 'ibm-plex-sans',
    name: 'IBM Plex Sans',
    category: 'sans',
    description: 'Clean technical sans',
    cssFamily: '"IBM Plex Sans", system-ui, sans-serif',
    files: {
      regular: fontUrl('ibm-plex-sans', 400),
      bold: fontUrl('ibm-plex-sans', 700),
      italic: fontUrl('ibm-plex-sans', 400, 'italic'),
      boldItalic: fontUrl('ibm-plex-sans', 700, 'italic'),
    },
  },
  {
    id: 'libre-baskerville',
    name: 'Libre Baskerville',
    category: 'serif',
    description: 'Serif for papers & notes',
    cssFamily: '"Libre Baskerville", Georgia, serif',
    files: {
      regular: fontUrl('libre-baskerville', 400),
      bold: fontUrl('libre-baskerville', 700),
      italic: fontUrl('libre-baskerville', 400, 'italic'),
      boldItalic: fontUrl('libre-baskerville', 700, 'italic'),
    },
  },
  {
    id: 'source-serif-4',
    name: 'Source Serif 4',
    category: 'serif',
    description: 'Editorial long-form reading',
    cssFamily: '"Source Serif 4", Georgia, serif',
    files: {
      regular: fontUrl('source-serif-4', 400),
      bold: fontUrl('source-serif-4', 700),
      italic: fontUrl('source-serif-4', 400, 'italic'),
      boldItalic: fontUrl('source-serif-4', 700, 'italic'),
    },
  },
  {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    category: 'mono',
    description: 'Code-friendly monospace',
    cssFamily: '"IBM Plex Mono", ui-monospace, monospace',
    files: {
      regular: fontUrl('ibm-plex-mono', 400),
      bold: fontUrl('ibm-plex-mono', 700),
      italic: fontUrl('ibm-plex-mono', 400, 'italic'),
      boldItalic: fontUrl('ibm-plex-mono', 700, 'italic'),
    },
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'mono',
    description: 'Developer docs mono',
    cssFamily: '"JetBrains Mono", ui-monospace, monospace',
    files: {
      regular: fontUrl('jetbrains-mono', 400),
      bold: fontUrl('jetbrains-mono', 700),
      italic: fontUrl('jetbrains-mono', 400, 'italic'),
      boldItalic: fontUrl('jetbrains-mono', 700, 'italic'),
    },
  },
];

export const DEFAULT_TYPEFACE_ID = 'lato';

export function getTypeface(id) {
  return TYPEFACES.find((t) => t.id === id) || TYPEFACES.find((t) => t.id === DEFAULT_TYPEFACE_ID);
}

export function filterTypefaces(category) {
  if (!category || category === 'all') return TYPEFACES;
  return TYPEFACES.filter((t) => t.category === category);
}

const fontBytesCache = new Map();

async function fetchFontBytes(url) {
  if (fontBytesCache.has(url)) return fontBytesCache.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load font: ${url}`);
  const bytes = await response.arrayBuffer();
  fontBytesCache.set(url, bytes);
  return bytes;
}

/**
 * Load regular/bold/italic/boldItalic font bytes for a typeface.
 * Missing styles fall back to the closest available face.
 */
export async function loadTypefaceFontBytes(typefaceId) {
  const typeface = getTypeface(typefaceId);
  const results = {};
  const keys = ['regular', 'bold', 'italic', 'boldItalic'];

  await Promise.all(
    keys.map(async (key) => {
      try {
        results[key] = await fetchFontBytes(typeface.files[key]);
      } catch {
        results[key] = null;
      }
    })
  );

  if (!results.regular) {
    throw new Error(`Could not load typeface "${typeface.name}".`);
  }

  results.bold = results.bold || results.regular;
  results.italic = results.italic || results.regular;
  results.boldItalic = results.boldItalic || results.bold || results.italic || results.regular;

  return { typeface, bytes: results };
}
