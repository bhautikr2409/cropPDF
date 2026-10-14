import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOOLS, categoryClass } from '../../constants/toolsCatalog';
import ToolMark from '../tools/ToolMark';
import ToolIcon from '../tools/ToolIcon';

const QUICK_PICKS = ['merge', 'compress', 'split'];

/**
 * One real tool per category, fanned from a shared pivot below the cards.
 * `label` is short enough to stay readable in the strip each card shows
 * while overlapped; hover/focus brings the card to the front.
 */
const FAN = [
  { toolId: 'protect', label: 'Protect', blurb: 'Lock a PDF with a password', angle: -14, x: -172 },
  { toolId: 'pdf-to-image', label: 'PDF to image', blurb: 'Save pages as PNG or JPG', angle: -7, x: -86 },
  { toolId: 'compress', label: 'Compress', blurb: 'Shrink a PDF so it is easy to email', angle: 0, x: 0 },
  { toolId: 'edit', label: 'Edit', blurb: 'Add text, shapes and images', angle: 7, x: 86 },
  { toolId: 'merge', label: 'Merge', blurb: 'Combine PDFs in the order you want', angle: 14, x: 172 },
];

const CARD_W = 190;

/**
 * Card geometry is multiplied by --fan-k per breakpoint instead of using a
 * CSS `scale()` on the whole fan — scaling a rotated group blurs its text.
 */
function ToolFan() {
  return (
    <nav
      aria-label="Popular tools"
      className="relative mx-auto h-[230px] w-full max-w-[560px] [--fan-k:0.6] sm:h-[380px] sm:[--fan-k:0.85] md:h-[420px] md:[--fan-k:1]"
    >
      <ul className="page-stack absolute bottom-12 left-1/2 h-0 w-0 sm:bottom-10">
        {FAN.map(({ toolId, label, blurb, angle, x }) => {
          const tool = TOOLS.find((t) => t.id === toolId);
          return (
            <li
              key={toolId}
              className="absolute bottom-0 hover:z-10 focus-within:z-10"
              style={{
                left: `calc(${-CARD_W / 2}px * var(--fan-k))`,
                width: `calc(${CARD_W}px * var(--fan-k))`,
                transformOrigin: '50% 130%',
                transform: `translateX(calc(${x}px * var(--fan-k))) rotate(${angle}deg)`,
              }}
            >
              <Link
                to={tool.to}
                className={`${categoryClass(tool)} group flex h-[158px] flex-col rounded-[16px] bg-accent-500 p-3 text-white shadow-lift outline-offset-4 transition-transform duration-300 ease-out hover:-translate-y-3 focus-visible:-translate-y-3 sm:h-[224px] sm:rounded-[22px] sm:p-4 sm:hover:-translate-y-5 md:h-[264px] md:rounded-[26px] md:p-5`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 [&_svg]:h-4 [&_svg]:w-4 sm:h-10 sm:w-10 sm:rounded-xl sm:[&_svg]:h-6 sm:[&_svg]:w-6 md:h-12 md:w-12 md:rounded-2xl md:[&_svg]:h-7 md:[&_svg]:w-7">
                  <ToolIcon name={tool.icon} />
                </span>
                <span className="mt-3 font-display text-[13px] font-bold leading-tight sm:mt-4 sm:text-lg md:mt-5 md:text-xl">
                  {label}
                </span>
                <span className="mt-1 text-[10px] leading-snug text-white/85 sm:mt-2 sm:text-[13px] md:text-[15px]">
                  {blurb}
                </span>
                <span className="mt-auto inline-flex w-fit items-center rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold transition-colors group-hover:bg-white group-hover:text-accent-700 sm:px-3 sm:text-xs md:px-3.5 md:py-1.5 md:text-sm">
                  Open
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function HomeHero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/tools?q=${encodeURIComponent(q)}` : '/tools');
  };

  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-ink-50">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 xl:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pb-20 lg:pt-20">
        <div>
          <h1 className="max-w-[13ch] text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
            Fix any PDF without uploading it
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 sm:text-xl">
            Merge, split, compress, convert and protect PDFs for free. Everything happens on your
            device, so your files are never sent anywhere.
          </p>

          <form onSubmit={onSubmit} className="mt-8 flex max-w-xl gap-2 rounded-full border border-ink-200 bg-white p-1.5 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/15">
            <label htmlFor="hero-search" className="sr-only">
              Search tools
            </label>
            <input
              id="hero-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you need to do?"
              className="min-w-0 flex-1 bg-transparent pl-5 text-base text-ink-900 outline-none placeholder:text-ink-400"
            />
            <button type="submit" className="btn-primary px-6">
              Find a tool
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-ink-500">Popular:</span>
            {QUICK_PICKS.map((id) => {
              const tool = TOOLS.find((t) => t.id === id);
              return (
                <Link
                  key={id}
                  to={tool.to}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-200 bg-white pl-1 pr-4 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-300"
                >
                  <ToolMark tool={tool} size="sm" className="!rounded-full" />
                  {tool.title}
                </Link>
              );
            })}
          </div>
        </div>

        <ToolFan />
      </div>
    </section>
  );
}
