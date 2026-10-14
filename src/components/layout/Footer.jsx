import { Link } from 'react-router-dom';
import { TOOL_GROUPS } from '../../constants/toolsCatalog';
import { BrandMark } from './Header';

const COMPANY_LINKS = [
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact' },
  { to: '/guide', label: 'Help guide' },
  { to: '/resources', label: 'Resources' },
  { to: '/privacy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms of service' },
];

function FooterColumn({ title, children, className = '' }) {
  return (
    <div className={className}>
      <h2 className="mb-4 flex items-center gap-2 font-sans text-sm font-semibold text-white">{title}</h2>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-[15px] text-ink-300 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_3fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2" aria-label="PDFCraft home">
              <BrandMark className="h-9 w-9" />
              <span className="font-display text-xl font-bold text-white">PDFCraft</span>
            </Link>
            <p className="mt-4 max-w-xs leading-relaxed text-ink-400">
              Free PDF tools that run in your browser. Your files never leave your device.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {TOOL_GROUPS.map((group) => (
              <FooterColumn
                key={group.id}
                className={group.className}
                title={
                  <>
                    <span className="h-2 w-2 rounded-full bg-accent-400" aria-hidden="true" />
                    {group.label}
                  </>
                }
              >
                {group.tools.map((tool) => (
                  <FooterLink key={tool.id} to={tool.to}>
                    {tool.title}
                  </FooterLink>
                ))}
              </FooterColumn>
            ))}
            <FooterColumn title="PDFCraft">
              {COMPANY_LINKS.map((link) => (
                <FooterLink key={link.to} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} PDFCraft. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Ad settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
