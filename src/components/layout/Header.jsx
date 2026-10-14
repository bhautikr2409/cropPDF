import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { TOOL_GROUPS } from '../../constants/toolsCatalog';
import ToolMark from '../tools/ToolMark';

const FEEDBACK_URL = 'https://forms.gle/wZunnbhxJ2yaSe5s8';

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Three fanned pages in category colours — the brand mark. */
export function BrandMark({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="4" y="7" width="15" height="19" rx="3" fill="#2A7DF5" transform="rotate(-12 11.5 16.5)" />
      <rect x="9" y="5" width="15" height="19" rx="3" fill="#E83E7A" transform="rotate(4 16.5 14.5)" />
      <rect x="12" y="8" width="15" height="19" rx="3" fill="#F65E1E" transform="rotate(14 19.5 17.5)" />
      <path d="M17 15h6M17 19h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" transform="rotate(14 19.5 17.5)" />
    </svg>
  );
}

function BrandLogo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="PDFCraft home">
      <BrandMark />
      <span className="font-display text-[19px] font-bold tracking-tight text-ink-900">PDFCraft</span>
    </Link>
  );
}

function ToolsMenu({ open, onOpen, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div ref={ref} className="static">
      <button
        type="button"
        className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[15px] font-semibold transition-colors ${
          open ? 'bg-ink-100 text-ink-900' : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900'
        }`}
        aria-expanded={open}
        onClick={() => (open ? onClose() : onOpen())}
      >
        Tools
        <Chevron open={open} />
      </button>

      {open && (
        <div className="absolute inset-x-4 top-full z-50 mt-2 rounded-3xl border border-ink-200 bg-white shadow-lift sm:inset-x-6">
          <div className="grid grid-cols-5 gap-6 p-7">
            {TOOL_GROUPS.map((group) => (
              <div key={group.id} className={group.className}>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-500" aria-hidden="true" />
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.tools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        to={tool.to}
                        onClick={onClose}
                        className="-mx-2 flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-[15px] text-ink-700 transition-colors hover:bg-accent-50 hover:text-ink-900"
                      >
                        <ToolMark tool={tool} size="sm" />
                        {tool.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const navLinkClass = ({ isActive }) =>
  `inline-flex h-10 items-center rounded-full px-4 text-[15px] font-semibold transition-colors ${
    isActive ? 'bg-ink-100 text-ink-900' : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900'
  }`;

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/90 backdrop-blur-md">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <BrandLogo />

        <div className="ml-4 hidden items-center gap-1 lg:flex">
          <ToolsMenu open={menuOpen} onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)} />
          <NavLink to="/guide" className={navLinkClass}>
            Guide
          </NavLink>
          <NavLink to="/resources" className={navLinkClass}>
            Resources
          </NavLink>
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-full px-4 text-[15px] font-semibold text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900"
          >
            Feedback
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/tools"
            className="hidden h-10 items-center rounded-full bg-ink-900 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-ink-700 sm:inline-flex"
          >
            All tools
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-800 transition-colors hover:bg-ink-50 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id={menuId} className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ink-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-6">
            {TOOL_GROUPS.map((group) => (
              <div key={group.id} className={group.className}>
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-500" aria-hidden="true" />
                  {group.label}
                </p>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {group.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.to}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-[15px] font-medium text-ink-800 hover:bg-accent-50"
                    >
                      <ToolMark tool={tool} size="sm" />
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-2 border-t border-ink-100 pt-5">
              <Link to="/guide" className="btn-secondary">
                Guide
              </Link>
              <Link to="/resources" className="btn-secondary">
                Resources
              </Link>
              <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Feedback
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
