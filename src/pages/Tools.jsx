import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'edit', label: 'Edit PDF' },
  { id: 'organize', label: 'Organize PDF' },
  { id: 'optimize', label: 'Optimize PDF' },
  { id: 'convert', label: 'Convert PDF' },
];

const TOOLS = [
  {
    id: 'crop',
    title: 'Crop PDF',
    description: 'Trim margins or focus on a region. Runs entirely in your browser.',
    to: '/crop',
    category: 'edit',
    available: true,
    accent: 'blue',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="8" y="10" width="28" height="32" rx="3" className="fill-blue-100 stroke-blue-600" strokeWidth="2" />
        <path d="M18 6v8M30 6v8M14 22h20M14 30h12" className="stroke-blue-600" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 28l6 6M40 28l-6 6" className="stroke-blue-600" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple PDFs in the order you want. Runs entirely in your browser.',
    to: '/merge',
    category: 'organize',
    available: true,
    accent: 'rose',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="6" y="12" width="18" height="24" rx="2" className="fill-rose-100 stroke-rose-500" strokeWidth="2" />
        <rect x="24" y="12" width="18" height="24" rx="2" className="fill-rose-50 stroke-rose-500" strokeWidth="2" />
        <path d="M20 24h8M24 20v8" className="stroke-rose-500" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Extract pages or split a PDF into separate files. Runs entirely in your browser.',
    to: '/split',
    category: 'organize',
    available: true,
    accent: 'orange',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="8" y="8" width="14" height="32" rx="2" className="fill-orange-100 stroke-orange-500" strokeWidth="2" />
        <rect x="26" y="8" width="14" height="32" rx="2" className="fill-orange-50 stroke-orange-500" strokeWidth="2" />
        <path d="M24 18v12" className="stroke-orange-500" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Reduce file size while keeping quality suitable for sharing.',
    to: null,
    category: 'optimize',
    available: false,
    accent: 'emerald',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="12" y="8" width="24" height="32" rx="3" className="fill-emerald-100 stroke-emerald-600" strokeWidth="2" />
        <path d="M20 20h8M18 28h12" className="stroke-emerald-600" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 34v6M21 37h6" className="stroke-emerald-600" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'rotate',
    title: 'Rotate PDF',
    description: 'Rotate pages left or right and save a corrected document.',
    to: null,
    category: 'edit',
    available: false,
    accent: 'teal',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="14" y="12" width="20" height="26" rx="2" className="fill-teal-100 stroke-teal-600" strokeWidth="2" />
        <path d="M34 18a12 12 0 11-4-8" className="stroke-teal-600" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 8l4 2-2 4" className="stroke-teal-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image',
    description: 'Export PDF pages as PNG or JPEG images on your device.',
    to: null,
    category: 'convert',
    available: false,
    accent: 'sky',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="8" y="10" width="20" height="28" rx="2" className="fill-sky-100 stroke-sky-600" strokeWidth="2" />
        <rect x="22" y="16" width="18" height="18" rx="2" className="fill-sky-50 stroke-sky-600" strokeWidth="2" />
        <circle cx="28" cy="22" r="2" className="fill-sky-600" />
        <path d="M24 30l4-4 4 3 4-5 4 6H24z" className="fill-sky-200 stroke-sky-600" strokeWidth="1.5" />
      </svg>
    ),
  },
];

function ToolCard({ tool }) {
  const content = (
    <>
      <div className="mb-4">{tool.icon}</div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-lg font-bold text-slate-900">{tool.title}</h2>
        {!tool.available && (
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Soon
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>
    </>
  );

  const cardClassName = [
    'group relative flex flex-col h-full rounded-2xl border bg-white p-6 text-left transition-all duration-200',
    tool.available
      ? 'border-slate-200 hover:border-blue-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
      : 'border-slate-100 opacity-75 cursor-not-allowed',
  ].join(' ');

  if (tool.available && tool.to) {
    return (
      <Link to={tool.to} className={cardClassName} aria-label={`Open ${tool.title}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClassName} aria-disabled="true">
      {content}
    </div>
  );
}

export default function Tools() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = useMemo(() => {
    if (activeCategory === 'all') return TOOLS;
    return TOOLS.filter((tool) => tool.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-[#f5f7fb] min-h-[70vh] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            All PDF tools
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Free, client-side PDF utilities. Crop works today — more tools are on the roadmap.
          </p>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
          role="tablist"
          aria-label="Tool categories"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category.id)}
                className={[
                  'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                  isActive
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900',
                ].join(' ')}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <p className="text-center text-slate-500 py-16">No tools in this category yet.</p>
        )}
      </div>
    </div>
  );
}
