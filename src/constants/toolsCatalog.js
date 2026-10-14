/** Tool categories. `className` switches the accent palette (see index.css). */
export const CATEGORIES = [
  { id: 'all', label: 'All' },
  {
    id: 'organize',
    label: 'Organize',
    blurb: 'Combine, separate, and reorder pages',
    className: 'cat-organize',
  },
  {
    id: 'optimize',
    label: 'Optimize',
    blurb: 'Make files smaller to send',
    className: 'cat-optimize',
  },
  {
    id: 'edit',
    label: 'Edit',
    blurb: 'Change what is on the page',
    className: 'cat-edit',
  },
  {
    id: 'convert',
    label: 'Convert',
    blurb: 'Turn PDFs into images or text, and back',
    className: 'cat-convert',
  },
  {
    id: 'security',
    label: 'Secure',
    blurb: 'Add or remove a password',
    className: 'cat-security',
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

/** Accent class for a tool, e.g. `cat-organize`. */
export function categoryClass(toolOrId) {
  const tool = typeof toolOrId === 'string' ? TOOLS.find((t) => t.id === toolOrId) : toolOrId;
  return CATEGORY_BY_ID[tool?.category]?.className || '';
}

export const TOOLS = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine PDFs in the order you want. The easiest way to merge PDF files online.',
    to: '/merge',
    category: 'organize',
    available: true,
    icon: 'merge',
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Separate one page or a set of pages into independent PDF files.',
    to: '/split',
    category: 'organize',
    available: true,
    icon: 'split',
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Reduce file size while keeping quality suitable for sharing.',
    to: '/compress',
    category: 'optimize',
    available: true,
    icon: 'compress',
  },
  {
    id: 'crop',
    title: 'Crop PDF',
    description: 'Trim margins or focus on a region. Runs entirely in your browser.',
    to: '/crop',
    category: 'edit',
    available: true,
    icon: 'crop',
  },
  {
    id: 'add-logo',
    title: 'Add Logo to PDF',
    description:
      'Upload a PDF and a logo — place it in the bottom white space on every page.',
    to: '/add-logo',
    category: 'edit',
    available: true,
    icon: 'addLogo',
  },
  {
    id: 'edit',
    title: 'Edit PDF',
    description: 'Add text, images, shapes, or freehand drawings to your PDF.',
    to: '/edit',
    category: 'edit',
    available: true,
    icon: 'edit',
  },
  {
    id: 'rotate',
    title: 'Rotate PDF',
    description: 'Rotate pages left or right and save a corrected document.',
    to: '/rotate',
    category: 'edit',
    available: true,
    icon: 'rotate',
  },
  {
    id: 'compare',
    title: 'Compare PDF',
    description:
      'Show a side-by-side document comparison and easily spot changes between different file versions.',
    to: '/compare',
    category: 'organize',
    available: true,
    icon: 'compare',
  },
  {
    id: 'organize',
    title: 'Organize PDF',
    description:
      'Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.',
    to: '/organize',
    category: 'organize',
    available: true,
    icon: 'organize',
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image',
    description: 'Export PDF pages as PNG or JPEG images on your device.',
    to: '/pdf-to-image',
    category: 'convert',
    available: true,
    icon: 'pdfToImage',
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Combine JPG, PNG, or WEBP images into a single PDF document.',
    to: '/image-to-pdf',
    category: 'convert',
    available: true,
    icon: 'imageToPdf',
  },
  {
    id: 'pdf-to-markdown',
    title: 'PDF to Markdown',
    description: 'Extract PDF text into Markdown with headings and lists when possible.',
    to: '/pdf-to-markdown',
    category: 'convert',
    available: true,
    icon: 'markdown',
  },
  {
    id: 'markdown-to-pdf',
    title: 'Markdown to PDF',
    description: 'Upload a Markdown file or paste Markdown, then download a clean PDF.',
    to: '/markdown-to-pdf',
    category: 'convert',
    available: true,
    icon: 'markdownToPdf',
  },
  {
    id: 'protect',
    title: 'Protect PDF',
    description: 'Add a password with AES-256 encryption. Runs entirely in your browser.',
    to: '/protect',
    category: 'security',
    available: true,
    icon: 'protect',
  },
  {
    id: 'unlock',
    title: 'Unlock PDF',
    description: 'Remove password protection from a PDF using the known password.',
    to: '/unlock',
    category: 'security',
    available: true,
    icon: 'unlock',
  },
];

export const ALL_TOOLS_MENU = TOOLS.filter((t) => t.available);

/** Tools grouped by category, in catalog order. */
export const TOOL_GROUPS = CATEGORIES.filter((c) => c.id !== 'all').map((category) => ({
  ...category,
  tools: TOOLS.filter((t) => t.category === category.id && t.available),
}));
