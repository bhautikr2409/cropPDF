import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';

const faqs = [
  {
    q: 'How does client-side processing work?',
    a: 'PDFCropper runs entirely in your browser. Files are loaded into local memory, processed with JavaScript libraries, and downloaded from your device. Nothing is uploaded to our servers.',
  },
  {
    q: 'Will cropping reduce PDF quality?',
    a: 'No. Cropping adjusts page boundaries (CropBox / MediaBox). Embedded text and vectors stay in their original form — we do not rasterize pages for cropping.',
  },
  {
    q: 'Are my documents secure?',
    a: 'Yes. Because files never leave your browser, they are not transmitted to or stored on our servers. That makes the tool suitable for sensitive documents when used on a trusted device.',
  },
  {
    q: 'Which tools are available?',
    a: 'Merge, split, compress, crop, edit, rotate, convert (images & Markdown), protect, and unlock — all from the tools page on the homepage.',
  },
];

export default function Guide() {
  return (
    <StaticPageShell>
      <div className="mb-10 text-center sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-teal-700">Help & guide</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          How to use PDFCropper
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Quick steps for cropping PDFs, plus answers about privacy and how local processing works.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Crop a PDF in 3 steps</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              n: '1',
              title: 'Upload',
              text: 'Open Crop PDF and choose a file. It loads into browser memory only.',
            },
            {
              n: '2',
              title: 'Select area',
              text: 'Drag on the page to draw a crop box. Resize with the corner handles.',
            },
            {
              n: '3',
              title: 'Download',
              text: 'Click download to generate a cropped PDF locally and save it to your device.',
            },
          ].map((step) => (
            <div key={step.n}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-lg font-bold text-teal-700">
                {step.n}
              </div>
              <h3 className="mb-1 text-lg font-semibold text-slate-800">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <h3 className="mb-2 flex gap-2 text-base font-semibold text-slate-800">
                <span className="font-bold text-teal-600">Q</span>
                <span>{faq.q}</span>
              </h3>
              <p className="pl-6 text-sm leading-relaxed text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-teal-700 px-6 py-8 text-center text-white shadow-sm sm:px-10">
        <h2 className="mb-2 text-2xl font-bold">Start with any tool</h2>
        <p className="mb-6 text-sm text-teal-100">Private by design — files never leave your device.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-teal-800 transition hover:bg-teal-50"
          >
            Browse all tools
          </Link>
          <Link
            to="/crop"
            className="inline-flex h-11 items-center rounded-xl border border-teal-400/50 px-5 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Crop a PDF
          </Link>
        </div>
      </div>
    </StaticPageShell>
  );
}
