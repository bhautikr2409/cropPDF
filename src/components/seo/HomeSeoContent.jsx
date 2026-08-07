import { Link } from 'react-router-dom';
import { SITE_NAME } from '../../constants/site';
import { ACCENT, TOOLS } from '../../constants/toolsCatalog';
import ToolIcon from '../tools/ToolIcon';

const BENEFITS = [
  {
    title: '100% browser-based',
    text: 'Merge, split, compress, crop, convert, and protect PDFs without uploading files to a remote server.',
    icon: (
      <path
        d="M12 3v4M8 7h8M7 11h10v9a1 1 0 01-1 1H8a1 1 0 01-1-1v-9z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: 'No account required',
    text: 'Start instantly. PDFCraft does not force sign-ups, trials, or watermarks on core tools.',
    icon: (
      <path
        d="M12 12a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5.5 20a6.5 6.5 0 0113 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
    ),
  },
  {
    title: 'Built for privacy',
    text: 'Documents stay in local memory. Closing the tab clears your session. Ideal for sensitive paperwork.',
    icon: (
      <path
        d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: 'Full PDF toolkit',
    text: 'From organize and rotate to Markdown conversion and password protection — one private workspace.',
    icon: (
      <path
        d="M8 4h6l4 4v12H8V4zM14 4v4h4M10 13h6M10 17h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

const POPULAR_ORDER = ['merge', 'split', 'compress', 'crop', 'pdf-to-image', 'protect'];
const POPULAR = POPULAR_ORDER.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean);

function PopularToolCard({ tool }) {
  const accent = ACCENT[tool.accent] || ACCENT.teal;

  return (
    <li>
      <Link
        to={tool.to}
        aria-label={`Open ${tool.title}`}
        className={[
          'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 text-left transition-all duration-200 sm:p-6',
          'hover:-translate-y-0.5 hover:border-teal-200 hover:bg-[var(--page-bg)]',
          accent.hover,
        ].join(' ')}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.box} ${accent.icon}`}
          >
            <ToolIcon name={tool.icon} />
          </div>
          <span className="mt-1 text-xs font-semibold text-teal-700 opacity-0 transition group-hover:opacity-100">
            Open →
          </span>
        </div>

        <h3 className="text-[17px] font-bold text-slate-800">{tool.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{tool.description}</p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
          Open tool
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </li>
  );
}

/**
 * Long-form homepage content for AdSense quality + SEO internal links.
 */
export default function HomeSeoContent() {
  return (
    <section className="border-t border-slate-200/80 bg-[var(--page-bg)]">
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold text-teal-700">Why PDFCraft</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Free PDF tools that respect your privacy
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {SITE_NAME} is an online PDF toolkit for everyday document work. Unlike upload-based
            converters, we process files with modern browser APIs so invoices, contracts, and IDs
            never leave your device. Use it free — no installation required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  {item.icon}
                </svg>
              </div>
              <h3 className="mb-2 text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 sm:pt-10 mt-10">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            {/* <p className="mb-2 text-sm font-semibold text-teal-700">Most used</p> */}
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Popular PDF tools
            </h2>
            <p className="mt-3 text-slate-600">
              Jump into the most-used utilities. Each page includes a step-by-step guide and FAQ.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {POPULAR.map((tool) => (
              <PopularToolCard key={tool.id} tool={tool} />
            ))}
          </ul>

          <div className="mt-8 text-center">
            <Link
              to="/tools"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-900"
            >
              View all PDF tools
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <p className="mb-2 text-sm font-semibold text-teal-700">Privacy first</p>
              <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                How {SITE_NAME} keeps documents private
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                <p>
                  When you select a PDF, the browser reads it into memory. Libraries such as pdf.js
                  and pdf-lib transform the file locally. The download button saves the result from
                  your device — our servers only deliver the website code.
                </p>
                <p>
                  Advertising partners (including Google AdSense, when enabled) may use cookies to
                  show relevant ads. Ads never require access to the PDF bytes you process. Details
                  are in our{' '}
                  <Link to="/privacy" className="font-semibold text-teal-800 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/guide"
                  className="inline-flex h-10 items-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  Read the help guide
                </Link>
                <Link
                  to="/about"
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
                >
                  About {SITE_NAME}
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 border-t border-teal-100 bg-teal-50/70 px-6 py-8 sm:px-8 lg:border-l lg:border-t-0">
              {[
                'Files never leave your browser',
                'No signup to use tools',
                'HTTPS site delivery only',
              ].map((line) => (
                <div
                  key={line}
                  className="flex items-start gap-3 rounded-xl border border-teal-100/80 bg-white px-4 py-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-700 text-[11px] font-bold text-white">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-slate-800">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
