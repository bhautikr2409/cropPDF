import { useMemo, useState } from 'react';
import { TYPEFACE_FILTERS, filterTypefaces } from '../utils/typefaces';

export default function TypefacePicker({ value, onChange, disabled }) {
  const [filter, setFilter] = useState('all');
  const faces = useMemo(() => filterTypefaces(filter), [filter]);

  return (
    <aside className="flex max-h-[32rem] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:h-full xl:max-h-none">
      <div className="shrink-0 border-b border-slate-100 px-5 pb-4 pt-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Typeface
        </p>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Typeface category">
          {TYPEFACE_FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                disabled={disabled}
                onClick={() => setFilter(item.id)}
                className={[
                  'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                  active
                    ? 'bg-[#1e293b] text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                  disabled ? 'cursor-not-allowed opacity-50' : '',
                ].join(' ')}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-4 sm:px-5">
        {faces.map((face) => {
          const selected = value === face.id;
          return (
            <li key={face.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange?.(face.id)}
                aria-pressed={selected}
                className={[
                  'group flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-150',
                  selected
                    ? 'border-teal-500 bg-teal-50/70 shadow-[0_0_0_1px_rgba(20,184,166,0.35)]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80',
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                ].join(' ')}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={[
                      'truncate text-[17px] leading-snug tracking-tight text-slate-900',
                      face.category === 'serif' ? 'font-normal' : 'font-semibold',
                    ].join(' ')}
                    style={{ fontFamily: face.cssFamily }}
                  >
                    {face.name}
                  </p>
                  <p className="mt-1 truncate text-[12px] leading-snug text-slate-500">
                    {face.description}
                  </p>
                </div>

                <span
                  className={[
                    'shrink-0 select-none text-[34px] leading-none tracking-tight',
                    selected ? 'text-slate-800' : 'text-slate-600',
                  ].join(' ')}
                  style={{ fontFamily: face.cssFamily }}
                  aria-hidden="true"
                >
                  Aa
                </span>
              </button>
            </li>
          );
        })}

        {faces.length === 0 ? (
          <li className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            No typefaces in this category.
          </li>
        ) : null}
      </ul>

      <div className="shrink-0 border-t border-slate-100 px-5 py-3">
        <p className="text-[11px] leading-relaxed text-slate-400">
          Selected font is used for preview and the downloaded PDF.
        </p>
      </div>
    </aside>
  );
}
