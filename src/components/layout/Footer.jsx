import { Link } from 'react-router-dom';

const POPULAR_TOOLS = [
  { to: '/merge', label: 'Merge PDF' },
  { to: '/split', label: 'Split PDF' },
  { to: '/compress', label: 'Compress PDF' },
  { to: '/crop', label: 'Crop PDF' },
  { to: '/edit', label: 'Edit PDF' },
  { to: '/rotate', label: 'Rotate PDF' },
];

const CONVERT_LINKS = [
  { to: '/pdf-to-image', label: 'PDF to Image' },
  { to: '/image-to-pdf', label: 'Image to PDF' },
  { to: '/pdf-to-markdown', label: 'PDF to Markdown' },
];

const SECURITY_LINKS = [
  { to: '/protect', label: 'Protect PDF' },
  { to: '/unlock', label: 'Unlock PDF' },
];

const COMPANY_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/guide', label: 'Help & Guide' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm text-slate-400 transition-colors hover:text-teal-300"
    >
      {children}
    </Link>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-slate-300">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.to}>
            <FooterLink to={link.to}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
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
              <span className="text-lg font-extrabold tracking-tight text-white">
                PDF<span className="text-teal-400">Cropper</span>
              </span>
            </Link>

            <p className="mb-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Free PDF tools that run entirely in your browser. Your files never leave your device.
            </p>

            <div className="inline-flex items-center gap-2 rounded-lg border border-teal-800/60 bg-teal-950/50 px-3 py-2 text-xs font-semibold text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              100% client-side · No uploads
            </div>
          </div>

          {/* Popular */}
          <div className="lg:col-span-2">
            <FooterColumn title="Popular" links={POPULAR_TOOLS} />
          </div>

          {/* Convert */}
          <div className="lg:col-span-2">
            <FooterColumn title="Convert" links={CONVERT_LINKS} />
            <div className="mt-8">
              <FooterColumn title="Security" links={SECURITY_LINKS} />
            </div>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>

          {/* CTA */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-slate-300">
              Get started
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Browse every tool in one place and start editing PDFs privately.
            </p>
            <Link
              to="/"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              All PDF tools
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
          <p>© {currentYear} PDFCropper. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-slate-300">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-slate-300">
              Terms
            </Link>
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-slate-300"
            >
              Ad Options & Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
