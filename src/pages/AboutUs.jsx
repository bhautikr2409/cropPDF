import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';

export default function AboutUs() {
  const seo = STATIC_SEO.about;

  return (
    <StaticPageShell>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: seo.title,
          url: `${SITE_URL}/about`,
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        }}
      />

      <div className="mb-10 text-center sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-teal-700">About us</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          About {SITE_NAME}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Fast, private PDF tools at{' '}
          <span className="font-semibold text-slate-800">pdfcraft.aadrim.in</span> — merge, split,
          compress, crop, convert, edit, and protect documents entirely in your browser.
        </p>
      </div>

      <div className="space-y-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <section className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-800">Our mission</h2>
            <p className="mb-3 leading-relaxed text-slate-600">
              Many online PDF services ask you to upload personal documents to remote servers. That
              creates privacy risk and unnecessary exposure of sensitive files — invoices, IDs,
              contracts, and medical paperwork.
            </p>
            <p className="leading-relaxed text-slate-600">
              {SITE_NAME} eliminates that risk. We process documents locally in your browser so your
              files never leave your device. Our servers only deliver the website — they never see
              your PDFs.
            </p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
            <h3 className="mb-3 font-semibold text-teal-900">Why choose {SITE_NAME}?</h3>
            <ul className="space-y-3 text-sm text-slate-700">
              {[
                ['100% client-side', 'Zero uploads — documents stay private.'],
                ['No signup', 'Start immediately with no email required.'],
                ['Free toolkit', 'Merge, split, compress, crop, convert, protect, and more.'],
                ['Clear policies', 'Transparent Privacy Policy and Terms for trust & AdSense compliance.'],
              ].map(([title, text]) => (
                <li key={title} className="flex items-start gap-2">
                  <span className="mt-0.5 font-bold text-teal-600">✓</span>
                  <span>
                    <strong>{title}:</strong> {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="border-slate-100" />

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">How it works</h2>
          <p className="mb-3 leading-relaxed text-slate-600">
            When you select a PDF, it is read into browser memory. We use libraries like{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">pdfjs-dist</code> and{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">pdf-lib</code> to render and
            transform documents locally, then download the result from your device.
          </p>
          <p className="leading-relaxed text-slate-600">
            Advertising (including Google AdSense when enabled) may use cookies to fund free access
            to these tools. Ads never require access to the PDF bytes you process. See our{' '}
            <Link to="/privacy" className="font-semibold text-teal-700 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">Who we serve</h2>
          <p className="leading-relaxed text-slate-600">
            Students, freelancers, small businesses, and anyone who needs quick PDF fixes without
            installing desktop software or trusting unknown upload portals. Whether you are merging
            reports, compressing scans for email, or password-protecting a contract, {SITE_NAME} is
            built to be useful, honest, and private.
          </p>
        </section>

        <div className="rounded-2xl border border-teal-100 bg-[var(--page-bg)] px-6 py-8 text-center">
          <h3 className="mb-2 text-lg font-bold text-slate-800">Ready to get started?</h3>
          <p className="mb-5 text-sm text-slate-500">Browse every tool — free and private.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Browse all tools
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-teal-200"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </StaticPageShell>
  );
}
