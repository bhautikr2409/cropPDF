import { Link } from 'react-router-dom';
import { TOOLS } from '../../constants/toolsCatalog';
import { SITE_NAME, SITE_URL } from '../../constants/site';
import { getToolSeo } from '../../constants/seoContent';
import SeoHead from './SeoHead';
import ToolMark from '../tools/ToolMark';

function buildToolJsonLd(seo) {
  const faqEntities = (seo.faqs || []).map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${seo.h1} — ${SITE_NAME}`,
        url: `${SITE_URL}${seo.path}`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any (modern browser)',
        browserRequirements: 'Requires JavaScript',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: seo.description,
        provider: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: `${SITE_URL}/tools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: seo.h1,
            item: `${SITE_URL}${seo.path}`,
          },
        ],
      },
      faqEntities.length
        ? {
            '@type': 'FAQPage',
            mainEntity: faqEntities,
          }
        : null,
    ].filter(Boolean),
  };
}

/**
 * AdSense-oriented article + FAQ + internal links for a tool page.
 * Also injects the page <SeoHead> + JSON-LD.
 */
export default function ToolSeoSection({ toolId }) {
  const seo = getToolSeo(toolId);
  if (!seo) return null;

  const relatedTools = (seo.related || [])
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean);

  const linkClass = 'font-semibold text-accent-700 underline decoration-accent-200 underline-offset-4 hover:decoration-accent-600';

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={buildToolJsonLd(seo)}
      />

      <article className="mt-20 space-y-12 text-left">
        <header>
          <h2 className="text-3xl font-bold">About this tool</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-700">{seo.intro}</p>
        </header>

        {(seo.sections || []).map((section) => (
          <section key={section.heading}>
            <h3 className="mb-3 text-xl font-semibold">{section.heading}</h3>
            <div className="space-y-4 text-[17px] leading-[1.75] text-ink-700">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        {(seo.faqs || []).length > 0 && (
          <section>
            <h3 className="mb-4 text-xl font-semibold">Questions people ask</h3>
            <div className="divide-y divide-ink-200 border-y border-ink-200">
              {seo.faqs.map((faq) => (
                <details key={faq.q} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700 transition-transform group-open:rotate-45" aria-hidden="true">
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-5 pr-12 leading-relaxed text-ink-700">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl bg-accent-50 px-6 py-7 sm:px-8">
          <h3 className="mb-2 text-lg font-semibold">Your file stays on your device</h3>
          <p className="leading-relaxed text-ink-700">
            {SITE_NAME} runs this tool inside your browser. Your document is never uploaded to our
            servers, and closing the tab clears it from memory. See our{' '}
            <Link to="/privacy" className={linkClass}>
              Privacy Policy
            </Link>{' '}
            or the{' '}
            <Link to="/guide" className={linkClass}>
              Help Guide
            </Link>
            .
          </p>
        </section>

        {relatedTools.length > 0 ? (
          <section>
            <h3 className="mb-4 text-xl font-semibold">Related tools</h3>
            <ul className="flex flex-wrap gap-2">
              {relatedTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    to={tool.to}
                    className="inline-flex items-center gap-2.5 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-4 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-300 hover:bg-ink-50"
                  >
                    <ToolMark tool={tool} size="sm" className="!rounded-full" />
                    {tool.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/tools" className="btn-secondary h-10 py-0">
                  All tools
                </Link>
              </li>
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
