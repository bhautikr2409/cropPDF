export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'edit', label: 'Edit PDF' },
  { id: 'organize', label: 'Organize PDF' },
  { id: 'optimize', label: 'Optimize PDF' },
  { id: 'convert', label: 'Convert PDF' },
  { id: 'security', label: 'PDF Security' },
];

/** Shared accent tokens for tool cards + header chips */
export const ACCENT = {
  blue: { box: 'bg-blue-50', icon: 'text-blue-600', hover: 'group-hover:border-blue-200' },
  fuchsia: { box: 'bg-fuchsia-50', icon: 'text-fuchsia-600', hover: 'group-hover:border-fuchsia-200' },
  rose: { box: 'bg-rose-50', icon: 'text-rose-500', hover: 'group-hover:border-rose-200' },
  orange: { box: 'bg-orange-50', icon: 'text-orange-500', hover: 'group-hover:border-orange-200' },
  emerald: { box: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'group-hover:border-emerald-200' },
  teal: { box: 'bg-teal-50', icon: 'text-teal-600', hover: 'group-hover:border-teal-200' },
  sky: { box: 'bg-sky-50', icon: 'text-sky-600', hover: 'group-hover:border-sky-200' },
  indigo: { box: 'bg-indigo-50', icon: 'text-indigo-600', hover: 'group-hover:border-indigo-200' },
  cyan: { box: 'bg-cyan-50', icon: 'text-cyan-600', hover: 'group-hover:border-cyan-200' },
  amber: { box: 'bg-amber-50', icon: 'text-amber-600', hover: 'group-hover:border-amber-200' },
  stone: { box: 'bg-stone-100', icon: 'text-stone-700', hover: 'group-hover:border-stone-300' },
};

export const TOOLS = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine PDFs in the order you want. The easiest way to merge PDF files online.',
    to: '/merge',
    category: 'organize',
    available: true,
    accent: 'rose',
    icon: 'merge',
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Separate one page or a set of pages into independent PDF files.',
    to: '/split',
    category: 'organize',
    available: true,
    accent: 'orange',
    icon: 'split',
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Reduce file size while keeping quality suitable for sharing.',
    to: '/compress',
    category: 'optimize',
    available: true,
    accent: 'emerald',
    icon: 'compress',
  },
  {
    id: 'crop',
    title: 'Crop PDF',
    description: 'Trim margins or focus on a region. Runs entirely in your browser.',
    to: '/crop',
    category: 'edit',
    available: true,
    accent: 'teal',
    icon: 'crop',
  },
  {
    id: 'edit',
    title: 'Edit PDF',
    description: 'Add text, images, shapes, or freehand drawings to your PDF.',
    to: '/edit',
    category: 'edit',
    available: true,
    accent: 'fuchsia',
    icon: 'edit',
  },
  {
    id: 'rotate',
    title: 'Rotate PDF',
    description: 'Rotate pages left or right and save a corrected document.',
    to: '/rotate',
    category: 'edit',
    available: true,
    accent: 'sky',
    icon: 'rotate',
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image',
    description: 'Export PDF pages as PNG or JPEG images on your device.',
    to: '/pdf-to-image',
    category: 'convert',
    available: true,
    accent: 'sky',
    icon: 'pdfToImage',
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Combine JPG, PNG, or WEBP images into a single PDF document.',
    to: '/image-to-pdf',
    category: 'convert',
    available: true,
    accent: 'indigo',
    icon: 'imageToPdf',
  },
  {
    id: 'pdf-to-markdown',
    title: 'PDF to Markdown',
    description: 'Extract PDF text into Markdown with headings and lists when possible.',
    to: '/pdf-to-markdown',
    category: 'convert',
    available: true,
    accent: 'cyan',
    icon: 'markdown',
  },
  {
    id: 'protect',
    title: 'Protect PDF',
    description: 'Add a password with AES-256 encryption. Runs entirely in your browser.',
    to: '/protect',
    category: 'security',
    available: true,
    accent: 'amber',
    icon: 'protect',
  },
  {
    id: 'unlock',
    title: 'Unlock PDF',
    description: 'Remove password protection from a PDF using the known password.',
    to: '/unlock',
    category: 'security',
    available: true,
    accent: 'stone',
    icon: 'unlock',
  },
];

export const HEADER_PRIMARY = [
  { to: '/merge', label: 'Merge PDF' },
  { to: '/split', label: 'Split PDF' },
  { to: '/compress', label: 'Compress PDF' },
];

export const CONVERT_TOOLS = TOOLS.filter((t) => t.category === 'convert');
export const ALL_TOOLS_MENU = TOOLS.filter((t) => t.available);

export const MEGA_MENU_COLUMNS = [
  {
    id: 'organize',
    label: 'Organize PDF',
    tools: TOOLS.filter((t) => t.category === 'organize' && t.available),
  },
  {
    id: 'optimize',
    label: 'Optimize PDF',
    tools: TOOLS.filter((t) => t.category === 'optimize' && t.available),
  },
  {
    id: 'convert',
    label: 'Convert PDF',
    tools: TOOLS.filter((t) => t.category === 'convert' && t.available),
  },
  {
    id: 'edit',
    label: 'Edit PDF',
    tools: TOOLS.filter((t) => t.category === 'edit' && t.available),
  },
  {
    id: 'security',
    label: 'PDF Security',
    tools: TOOLS.filter((t) => t.category === 'security' && t.available),
  },
];
