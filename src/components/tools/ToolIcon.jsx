const iconClass = 'w-7 h-7';

const ICONS = {
  merge: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="3" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  split: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="3" y="3" width="7" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="18" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
    </svg>
  ),
  compress: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="6" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 8h6M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17v4M9.5 19.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  crop: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path d="M6 2v4M18 2v4M4 8h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path d="M4 20h4L18 10l-4-4L4 16v4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  rotate: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="7" y="6" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M17 8a7 7 0 11-2.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14.5 2.5l2 1.2-1.2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pdfToImage: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="3" y="4" width="10" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="11" y="8" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="11" r="1.2" fill="currentColor" />
      <path d="M12 16l2.5-2.5L16 15l2-2.5 2 3.5H12z" fill="currentColor" opacity="0.35" />
    </svg>
  ),
  imageToPdf: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="M5 16l4-4 3 3 2-2 4 3H5z" fill="currentColor" opacity="0.35" />
    </svg>
  ),
  markdown: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="4" y="4" width="11" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M7 9h5M7 12h5M7 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 12l4 6H15l1-2.5 1-1.5 1-2h2.5L18 18z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  protect: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    </svg>
  ),
  unlock: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 017-2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    </svg>
  ),
  compare: (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="3" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7 9h2M7 12h2M7 15h1M15 9h2M15 12h2M15 15h1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export default function ToolIcon({ name, className = '' }) {
  return <span className={`inline-flex ${className}`}>{ICONS[name] || ICONS.merge}</span>;
}
