import { useMemo, useState } from 'react';
import {
  TYPEFACE_FILTERS,
  filterTypefaces,
} from '../utils/typefaces';

export default function TypefacePicker({ value, onChange, disabled }) {
  const [filter, setFilter] = useState('all');
  const faces = useMemo(() => filterTypefaces(filter), [filter]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Typeface
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {TYPEFACE_FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => setFilter(item.id)}
              className={[
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition',
                active
                  ? 'bg-slate-800 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                disabled ? 'opacity-50' : '',
              ].join(' ')}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <ul className="max-h-[22rem] space-y-2 overflow-y-auto pr-1">
        {faces.map((face) => {
          const selected = value === face.id;
          return (
            <li key={face.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange?.(face.id)}
                className={[
                  'flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition',
                  selected
                    ? 'border-teal-500 bg-teal-50/60 ring-1 ring-teal-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60',
                  disabled ? 'opacity-50' : '',
                ].join(' ')}
              >
                <div className="min-w-0">
                  <p
                    className="truncate text-[15px] font-semibold text-slate-900"
                    style={{ fontFamily: face.cssFamily }}
                  >
                    {face.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{face.description}</p>
                </div>
                <span
                  className="shrink-0 text-3xl font-medium leading-none text-slate-700"
                  style={{ fontFamily: face.cssFamily }}
                  aria-hidden="true"
                >
                  Aa
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
