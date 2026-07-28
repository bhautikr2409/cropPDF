import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';

export default function AboutUs() {
  return (
    <StaticPageShell>
      <div className="mb-10 text-center sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-teal-700">About us</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          About PDFCropper
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Fast, private PDF tools that run entirely in your browser — no uploads, no account
          required.
        </p>
      </div>

      <div className="space-y-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <section className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-800">Our mission</h2>
            <p className="mb-3 leading-relaxed text-slate-600">
              Many online PDF services ask you to upload personal documents to remote servers. That
              creates privacy risk and unnecessary exposure of sensitive files.
            </p>
            <p className="leading-relaxed text-slate-600">
              We eliminate that risk. PDFCropper processes documents locally in your browser so your
              files never leave your device.
            </p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
            <h3 className="mb-3 font-semibold text-teal-900">Why choose us?</h3>
            <ul className="space-y-3 text-sm text-slate-700">
              {[
                ['100% client-side', 'Zero uploads — documents stay private.'],
                ['No signup', 'Start immediately with no email required.'],
                ['Fast', 'Local processing with modern web APIs.'],
                ['Full toolkit', 'Crop, merge, split, compress, convert, and more.'],
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
            edit documents locally, then download the result from your device.
          </p>
          <p className="leading-relaxed text-slate-600">
            Our servers only deliver the website — they never see your files.
          </p>
        </section>

        <div className="rounded-2xl border border-teal-100 bg-[var(--page-bg)] px-6 py-8 text-center">
          <h3 className="mb-2 text-lg font-bold text-slate-800">Ready to get started?</h3>
          <p className="mb-5 text-sm text-slate-500">Browse every tool — free and private.</p>
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Browse all tools
          </Link>
        </div>
      </div>
    </StaticPageShell>
  );
}
