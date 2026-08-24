import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';
import { RESOURCES_ARTICLES } from '../constants/resourcesArticles';

export default function Resources() {
  const seo = STATIC_SEO.resources;

  return (
    <StaticPageShell>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: seo.title,
          url: `${SITE_URL}/resources`,
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: RESOURCES_ARTICLES.map((article, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: article.h1,
              url: `${SITE_URL}${article.path}`,
            })),
          },
        }}
      />

      <div className="mb-10 text-center sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-teal-700">Resources</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Guides &amp; articles
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Practical writing about private PDF workflows, marketplace shipping labels, and everyday
          document tasks on {SITE_NAME}. Updated for sellers, students, and small teams.
        </p>
      </div>

      <div className="mb-10 space-y-5">
        {RESOURCES_ARTICLES.map((article) => (
          <article
            key={article.slug}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
              {article.category}
            </p>
            <h2 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl">
              <Link to={article.path} className="hover:text-teal-800 hover:underline">
                {article.h1}
              </Link>
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {article.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span>Updated {article.updated}</span>
              <Link
                to={article.path}
                className="font-semibold text-teal-700 hover:underline"
              >
                Read article →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-teal-100 bg-teal-50/50 px-6 py-8 text-center sm:px-10">
        <h2 className="mb-2 text-lg font-bold text-slate-900">Need step-by-step tool help?</h2>
        <p className="mb-5 text-sm text-slate-600">
          The Help Guide covers merge, split, compress, crop, label tools, and privacy FAQs.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/guide"
            className="inline-flex h-10 items-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-600"
          >
            Open Help Guide
          </Link>
          <Link
            to="/tools"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-teal-200"
          >
            Browse tools
          </Link>
        </div>
      </div>
    </StaticPageShell>
  );
}
