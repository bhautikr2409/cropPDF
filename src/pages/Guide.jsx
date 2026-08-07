import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO, TOOL_SEO } from '../constants/seoContent';
import { TOOLS } from '../constants/toolsCatalog';

const generalFaqs = [
  {
    q: 'How does client-side processing work?',
    a: `${SITE_NAME} runs entirely in your browser. Files are loaded into local memory, processed with JavaScript libraries, and downloaded from your device. Nothing is uploaded to our servers.`,
  },
  {
    q: 'Are my documents secure?',
    a: 'Yes. Because files never leave your browser, they are not transmitted to or stored on our servers. Use a trusted device and keep your OS up to date.',
  },
  {
    q: 'Is PDFCraft free?',
    a: 'Yes. Core tools are free to use without creating an account. The site may show ads (for example Google AdSense) to support hosting and development.',
  },
  {
    q: 'What file size limits apply?',
    a: 'Most PDF tools accept files up to 25 MB. Merge supports multiple files with a combined size cap so browsers stay responsive.',
  },
  {
    q: 'Which browsers are supported?',
    a: 'Current versions of Chrome, Edge, Firefox, and Safari. A modern browser with WebAssembly/Canvas support works best.',
  },
];

const guideTopics = [
  {
    id: 'merge',
    title: 'Merge PDF',
    steps: [
      'Open Merge PDF and add two or more files.',
      'Reorder with drag handles or arrows.',
      'Click Merge and download the combined PDF.',
    ],
  },
  {
    id: 'split',
    title: 'Split PDF',
    steps: [
      'Upload a PDF and enter page ranges (e.g. 1-3, 5).',
      'Run split to create separate files.',
      'Download each range as its own PDF.',
    ],
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    steps: [
      'Upload a large PDF.',
      'Choose Extreme, Recommended, or High quality.',
      'Download the smaller file for email or storage.',
    ],
  },
  {
    id: 'crop',
    title: 'Crop PDF',
    steps: [
      'Open Crop PDF and load your file.',
      'Drag to draw a crop box; resize with handles.',
      'Download the trimmed PDF.',
    ],
  },
  {
    id: 'protect',
    title: 'Protect PDF',
    steps: [
      'Upload the PDF you want to lock.',
      'Set a strong password and optional permissions.',
      'Download the encrypted PDF (AES-256).',
    ],
  },
];

export default function Guide() {
  const seo = STATIC_SEO.guide;
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: generalFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <StaticPageShell>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={faqJsonLd}
      />

      <div className="mb-10 text-center sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-teal-700">Help & guide</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          How to use {SITE_NAME}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Step-by-step guides for popular tools, plus answers about privacy, limits, and
          browser-based PDF processing on pdfcraft.aadrim.in.
        </p>
      </div>

      <div className="mb-8 space-y-6">
        {guideTopics.map((topic) => {
          const tool = TOOLS.find((t) => t.id === topic.id);
          const toolSeo = TOOL_SEO[topic.id];
          return (
            <article
              key={topic.id}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{topic.title}</h2>
                {tool ? (
                  <Link
                    to={tool.to}
                    className="text-sm font-semibold text-teal-700 hover:underline"
                  >
                    Open {topic.title} →
                  </Link>
                ) : null}
              </div>
              {toolSeo ? (
                <p className="mb-5 text-sm leading-relaxed text-slate-600">{toolSeo.intro}</p>
              ) : null}
              <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {topic.steps.map((text, i) => (
                  <li key={text} className="rounded-xl bg-[var(--page-bg)] p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-800">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700">{text}</p>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>

      <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">All tools</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOOLS.filter((t) => t.available).map((tool) => (
            <li key={tool.id}>
              <Link
                to={tool.to}
                className="flex items-start gap-3 rounded-xl border border-slate-100 px-4 py-3 transition hover:border-teal-200 hover:bg-teal-50/40"
              >
                <span className="font-semibold text-slate-900">{tool.title}</span>
                <span className="text-sm text-slate-500">{tool.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="space-y-6">
          {generalFaqs.map((faq) => (
            <div key={faq.q} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <h3 className="mb-2 text-base font-semibold text-slate-800">{faq.q}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-teal-700 px-6 py-8 text-center text-white shadow-sm sm:px-10">
        <h2 className="mb-2 text-2xl font-bold">Start with any tool</h2>
        <p className="mb-6 text-sm text-teal-100">
          Private by design — files never leave your device. Visit {SITE_URL.replace('https://', '')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-teal-800 transition hover:bg-teal-50"
          >
            Browse all tools
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-11 items-center rounded-xl border border-teal-400/50 px-5 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Contact support
          </Link>
        </div>
      </div>
    </StaticPageShell>
  );
}
