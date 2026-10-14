import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CATEGORIES, CATEGORY_BY_ID, TOOLS, TOOL_GROUPS } from '../../constants/toolsCatalog';
import ToolMark from './ToolMark';

export function ToolTile({ tool }) {
  const category = CATEGORY_BY_ID[tool.category];
  return (
    <Link
      to={tool.to}
      className={`${category?.className || ''} group flex h-full items-start gap-4 rounded-3xl border border-ink-200 bg-white p-5 transition-colors hover:border-accent-300 hover:bg-accent-50`}
    >
      <ToolMark tool={tool} className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className="min-w-0">
        <span className="block font-display text-[17px] font-semibold leading-snug text-ink-900">
          {tool.title}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-ink-600">{tool.description}</span>
      </span>
    </Link>
  );
}

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.9" />
      <path d="M14 14l3.5 3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

/** Home layout: one row per category, label on the left, tiles on the right. */
function GroupedCatalog() {
  return (
    <div className="space-y-12 lg:space-y-14">
      {TOOL_GROUPS.map((group) => (
        <section
          key={group.id}
          aria-labelledby={`cat-${group.id}`}
          className={`${group.className} grid gap-5 lg:grid-cols-[220px_1fr] lg:gap-10`}
        >
          <div className="lg:pt-3">
            <h3 id={`cat-${group.id}`} className="flex items-center gap-2.5 text-2xl font-bold">
              <span className="h-3.5 w-3.5 rounded-full bg-accent-500" aria-hidden="true" />
              {group.label}
            </h3>
            <p className="mt-1.5 text-ink-600">{group.blurb}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {group.tools.map((tool) => (
              <ToolTile key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** /tools layout: search + category tabs over a flat grid. */
function FilterCatalog() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (!tool.available) return false;
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false;
      if (!q) return true;
      const category = CATEGORY_BY_ID[tool.category]?.label.toLowerCase() || '';
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        category.includes(q)
      );
    });
  }, [activeCategory, query]);

  const reset = () => {
    setQuery('');
    setActiveCategory('all');
  };

  return (
    <>
      <div className="mb-5 max-w-xl">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for merge, crop, unlock…"
            className="h-14 w-full rounded-full border border-ink-200 bg-white pl-14 pr-5 text-base text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Tool categories">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(category.id)}
              className={`${category.className || ''} inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-ink-900 bg-ink-900 text-white'
                  : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50'
              }`}
            >
              {category.className && (
                <span className="h-2.5 w-2.5 rounded-full bg-accent-500" aria-hidden="true" />
              )}
              {category.label}
            </button>
          );
        })}
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolTile key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-ink-300 px-6 py-16 text-center">
          <p className="mb-1 font-display text-xl font-semibold text-ink-900">
            No tools match “{query.trim()}”
          </p>
          <p className="mb-5 text-ink-600">Try another word, like “merge” or “image”.</p>
          <button type="button" onClick={reset} className="btn-secondary">
            Show all tools
          </button>
        </div>
      )}
    </>
  );
}

export default function ToolsCatalog({
  variant = 'filter',
  title = 'All PDF tools',
  subtitle = 'Every tool runs in your browser. Pick one to get started.',
}) {
  if (variant === 'grouped') {
    return (
      <section id="tools" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="mb-10 text-3xl font-bold sm:text-4xl">Pick a tool</h2>
        <GroupedCatalog />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
      <p className="mb-8 mt-3 max-w-2xl text-lg text-ink-600">{subtitle}</p>
      <FilterCatalog />
    </section>
  );
}
