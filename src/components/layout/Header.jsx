import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ACCENT,
  ALL_TOOLS_MENU,
  CONVERT_TOOLS,
  HEADER_PRIMARY,
  MEGA_MENU_COLUMNS,
} from '../../constants/toolsCatalog';
import ToolIcon from '../tools/ToolIcon';

const navLinkClass =
  'inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-teal-50 hover:text-teal-800';

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 4l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrandLogo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" title="PDFCropper — free private PDF tools">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
        <svg viewBox="0 0 32 32" className="h-4 w-4" fill="none" aria-hidden="true">
          <rect x="7" y="5" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2.25" />
          <path
            d="M11 12h6M11 16h6M11 20h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[17px] font-extrabold leading-none tracking-tight text-slate-800">
        PDF<span className="text-teal-700">Cropper</span>
      </span>
    </Link>
  );
}

function ConvertDropdown({ open, onOpen, onClose, onNavigate }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose]);

  return (
    <div ref={ref} className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className={[
          'inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition',
          open
            ? 'bg-teal-50 text-teal-800'
            : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800',
        ].join(' ')}
        aria-expanded={open}
        onClick={() => (open ? onClose() : onOpen())}
      >
        Convert PDF
        <Chevron open={open} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 min-w-[220px] pt-2">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10">
            <div className="absolute -top-1.5 left-8 h-3 w-3 rotate-45 border-l border-t border-slate-200 bg-white" />
            {CONVERT_TOOLS.map((tool) => {
              const accent = ACCENT[tool.accent] || ACCENT.blue;
              return (
                <Link
                  key={tool.id}
                  to={tool.to}
                  onClick={onNavigate}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <span className={`${accent.icon} flex shrink-0`}>
                    <ToolIcon name={tool.icon} className="[&>svg]:h-5 [&>svg]:w-5" />
                  </span>
                  <span className="font-medium text-slate-800">{tool.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MegaMenuPanel({ onNavigate }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/12 sm:p-6">
      <div className="absolute -top-2 left-[min(68%,640px)] h-3.5 w-3.5 rotate-45 border-l border-t border-slate-200 bg-white" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {MEGA_MENU_COLUMNS.map((column) => (
          <div key={column.id} className="min-w-0">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
              {column.label}
            </p>
            <ul className="space-y-0.5">
              {column.tools.map((tool) => {
                const accent = ACCENT[tool.accent] || ACCENT.blue;
                return (
                  <li key={tool.id}>
                    <Link
                      to={tool.to}
                      onClick={onNavigate}
                      className="flex items-center gap-2.5 rounded-lg px-1 py-2 text-[13px] text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <span className={`${accent.icon} flex shrink-0`}>
                        <ToolIcon name={tool.icon} className="[&>svg]:h-[18px] [&>svg]:w-[18px]" />
                      </span>
                      <span className="font-medium leading-snug">{tool.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">
          All tools run locally in your browser — nothing is uploaded.
        </p>
        <Link
          to="/"
          onClick={onNavigate}
          className="inline-flex h-8 shrink-0 items-center rounded-lg bg-teal-700 px-3.5 text-xs font-semibold text-white transition hover:bg-teal-600"
        >
          View all tools
        </Link>
      </div>
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const menuId = useId();
  const megaWrapRef = useRef(null);
  const allToolsBtnRef = useRef(null);
  const closeTimerRef = useRef(null);

  const openAllTools = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu('all');
  };

  const scheduleCloseAllTools = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu((m) => (m === 'all' ? null : m));
      closeTimerRef.current = null;
    }, 160);
  };

  const popularMobile = useMemo(
    () => ALL_TOOLS_MENU.filter((t) => ['merge', 'split', 'compress', 'crop', 'edit'].includes(t.id)),
    []
  );

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, [location.pathname]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    []
  );

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (openMenu !== 'all') return undefined;
    const onDoc = (e) => {
      const inPanel = megaWrapRef.current?.contains(e.target);
      const inBtn = allToolsBtnRef.current?.contains(e.target);
      if (!inPanel && !inBtn) setOpenMenu(null);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:gap-8">
        {/* Left: brand */}
        <BrandLogo />

        {/* Center: primary nav */}
        <div className="hidden min-w-0 flex-1 items-center gap-0.5 xl:flex">
          {HEADER_PRIMARY.map((link) => (
            <Link key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </Link>
          ))}

          <ConvertDropdown
            open={openMenu === 'convert'}
            onOpen={() => setOpenMenu('convert')}
            onClose={() => setOpenMenu(null)}
            onNavigate={() => setOpenMenu(null)}
          />

          <div onMouseEnter={openAllTools} onMouseLeave={scheduleCloseAllTools}>
            <button
              ref={allToolsBtnRef}
              type="button"
              className={[
                'inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition',
                openMenu === 'all'
                  ? 'bg-teal-50 text-teal-800'
                  : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800',
              ].join(' ')}
              aria-expanded={openMenu === 'all'}
              onClick={() => setOpenMenu((m) => (m === 'all' ? null : 'all'))}
            >
              All PDF Tools
              <Chevron open={openMenu === 'all'} />
            </button>
          </div>
        </div>

        {/* Right: actions — evenly spaced, same height */}
        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
          <span
            className="hidden items-center gap-1.5 text-xs font-medium text-emerald-700 2xl:inline-flex"
            title="Files stay on your device"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Local only
          </span>

          <Link
            to="/guide"
            className="hidden h-9 items-center rounded-lg px-2 text-sm font-semibold text-slate-600 transition hover:text-teal-800 lg:inline-flex"
          >
            Help
          </Link>

          <Link
            to="/"
            className="hidden h-9 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-600 sm:inline-flex"
          >
            Browse tools
          </Link>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {openMenu === 'all' && (
        <div
          ref={megaWrapRef}
          className="absolute inset-x-0 top-full z-50 hidden xl:block"
          onMouseEnter={openAllTools}
          onMouseLeave={scheduleCloseAllTools}
        >
          <div className="px-4 pb-4 pt-2 sm:px-6">
            <div className="mx-auto max-w-7xl">
              <MegaMenuPanel onNavigate={() => setOpenMenu(null)} />
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div
          id={menuId}
          className="max-h-[80vh] overflow-y-auto border-t border-slate-200 bg-white xl:hidden"
        >
          <div className="mx-auto max-w-7xl space-y-5 px-4 py-4 sm:px-6">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800">
              Your PDFs are processed locally — nothing is uploaded.
            </div>

            <div className="grid grid-cols-2 gap-2">
              {popularMobile.map((tool) => {
                const accent = ACCENT[tool.accent] || ACCENT.blue;
                return (
                  <Link
                    key={tool.id}
                    to={tool.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 text-sm font-semibold text-slate-800"
                  >
                    <span className={`${accent.icon} flex shrink-0`}>
                      <ToolIcon name={tool.icon} className="[&>svg]:h-5 [&>svg]:w-5" />
                    </span>
                    {tool.title.replace(' PDF', '')}
                  </Link>
                );
              })}
            </div>

            {MEGA_MENU_COLUMNS.map((column) => (
              <div key={column.id}>
                <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                  {column.label}
                </p>
                <div className="flex flex-col">
                  {column.tools.map((tool) => {
                    const accent = ACCENT[tool.accent] || ACCENT.blue;
                    return (
                      <Link
                        key={tool.id}
                        to={tool.to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50"
                      >
                        <span className={`${accent.icon} flex shrink-0`}>
                          <ToolIcon name={tool.icon} className="[&>svg]:h-[18px] [&>svg]:w-[18px]" />
                        </span>
                        {tool.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Link
                to="/guide"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
              >
                Help
              </Link>
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-teal-700 text-sm font-semibold text-white"
              >
                Browse tools
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
