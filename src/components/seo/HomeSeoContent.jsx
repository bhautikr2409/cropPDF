import { Link } from 'react-router-dom';
import { SITE_NAME } from '../../constants/site';
import { TOOLS } from '../../constants/toolsCatalog';
import ToolMark from '../tools/ToolMark';

const HOW_LOCAL_WORKS = [
  {
    title: 'You choose a file',
    text: 'Your browser reads the PDF into this tab’s memory. Nothing is sent over the network.',
  },
  {
    title: 'Your device does the work',
    text: 'Open-source libraries (pdf.js and pdf-lib) merge, compress or convert it right here.',
  },
  {
    title: 'You download the result',
    text: 'The new file is saved from your device. Close the tab and the session is gone.',
  },
];

const PROMISES = [
  'No uploads, ever',
  'No account or email',
  'No watermarks',
  'Free for every tool',
];

const AUDIENCES = [
  {
    title: 'Students and freelancers',
    text: 'Merge assignments, shrink portfolio PDFs and turn notes into documents without signing up anywhere.',
    toolId: 'merge',
    cta: 'Merge PDFs',
  },
  {
    title: 'Small businesses',
    text: 'Combine invoices and put a password on contracts using a device you already trust.',
    toolId: 'protect',
    cta: 'Protect a PDF',
  },
  {
    title: 'Online sellers',
    text: 'Add your shop logo to the blank space on packing slips and invoices before you print.',
    toolId: 'add-logo',
    cta: 'Add a logo',
  },
];

const linkClass = 'font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 hover:decoration-brand-600';

/**
 * Long-form homepage content for AdSense quality + SEO internal links.
 */
export default function HomeSeoContent() {
  return (
    <div className="pb-20">
      {/* Privacy band */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-ink-900 px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="max-w-[14ch] text-4xl font-bold text-white sm:text-5xl">
                Your files never leave this device
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-300">
                Most PDF websites upload your documents to their servers. {SITE_NAME} works
                differently: the tools run inside your browser, so invoices, contracts and IDs stay
                with you.
              </p>
              <ul className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-3">
                {PROMISES.map((line) => (
                  <li key={line} className="flex items-center gap-2.5 text-[15px] font-medium text-white">
                    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-[#3EC67C]" fill="none" aria-hidden="true">
                      <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <ol className="space-y-4">
              {HOW_LOCAL_WORKS.map((step, index) => (
                <li key={step.title} className="flex gap-5 rounded-3xl bg-white/[0.06] p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-display text-lg font-bold text-ink-900">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-white">{step.title}</span>
                    <span className="mt-1 block leading-relaxed text-ink-300">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">Who uses {SITE_NAME}</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {AUDIENCES.map((item) => {
            const tool = TOOLS.find((t) => t.id === item.toolId);
            return (
              <div key={item.title} className="border-t-2 border-ink-900 pt-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{item.text}</p>
                <Link
                  to={tool.to}
                  className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-ink-200 py-1 pl-1 pr-4 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-300 hover:bg-ink-50"
                >
                  <ToolMark tool={tool} size="sm" className="!rounded-full" />
                  {item.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Long-form copy */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2 className="text-3xl font-bold sm:text-4xl">What you can do with {SITE_NAME}</h2>
          <div className="max-w-[68ch] space-y-5 text-[17px] leading-[1.75] text-ink-700">
            <p>
              Put multi-file reports together with{' '}
              <Link to="/merge" className={linkClass}>Merge PDF</Link>, pull out the pages you need
              with <Link to="/split" className={linkClass}>Split PDF</Link>, and shrink scans for
              email with <Link to="/compress" className={linkClass}>Compress PDF</Link>. Trim margins
              with <Link to="/crop" className={linkClass}>Crop PDF</Link>, then lock anything
              sensitive with <Link to="/protect" className={linkClass}>Protect PDF</Link>.
            </p>
            <p>
              Sellers can brand packing slips and invoices with{' '}
              <Link to="/add-logo" className={linkClass}>Add Logo</Link>. Convert between PDF,
              images and Markdown when you need an editable draft or a quick preview.
            </p>
            <p>
              Advertising partners such as Google AdSense may use cookies to show ads, but ads never
              get access to the files you process. The details are in our{' '}
              <Link to="/privacy" className={linkClass}>Privacy Policy</Link>, and the{' '}
              <Link to="/guide" className={linkClass}>Help Guide</Link> and{' '}
              <Link to="/resources" className={linkClass}>Resources</Link> explain each tool step by
              step. Read{' '}
              <Link to="/resources/why-browser-pdf-tools" className={linkClass}>
                why browser-based PDF tools are safer
              </Link>{' '}
              to learn more.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
