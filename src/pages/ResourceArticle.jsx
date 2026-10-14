import { Link, Navigate, useParams } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { getResourceArticle, RESOURCES_ARTICLES } from '../constants/resourcesArticles';

export default function ResourceArticle() {
  const { slug } = useParams();
  const article = getResourceArticle(slug);

  if (!article) {
    return <Navigate to="/resources" replace />;
  }

  const others = RESOURCES_ARTICLES.filter((a) => a.slug !== article.slug);

  return (
    <StaticPageShell>
      <SeoHead
        title={article.title}
        description={article.description}
        path={article.path}
        keywords={article.keywords}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.h1,
          description: article.description,
          datePublished: article.published,
          dateModified: article.updated,
          author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/pdfcraft-icon.png` },
          },
          mainEntityOfPage: `${SITE_URL}${article.path}`,
        }}
      />

      <nav className="mb-6 text-sm text-ink-500">
        <Link to="/" className="hover:text-brand-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/resources" className="hover:text-brand-700">
          Resources
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-700">{article.category}</span>
      </nav>

      <article className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold text-brand-700">{article.category}</p>
        <h1 className="mb-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          {article.h1}
        </h1>
        <p className="mb-2 text-lg leading-relaxed text-ink-600">{article.summary}</p>
        <p className="mb-8 text-xs text-ink-500">
          Published {article.published} · Updated {article.updated}
        </p>

        <div className="space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-xl font-bold text-ink-900">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="mb-3 text-[15px] leading-relaxed text-ink-600 last:mb-0">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-ink-100 pt-8">
          <Link
            to="/tools"
            className="inline-flex h-10 items-center rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Try PDF tools
          </Link>
          <Link
            to="/guide"
            className="inline-flex h-10 items-center rounded-xl border border-ink-200 px-4 text-sm font-semibold text-ink-700 hover:border-brand-200"
          >
            Help Guide
          </Link>
          <Link
            to="/about"
            className="inline-flex h-10 items-center rounded-xl border border-ink-200 px-4 text-sm font-semibold text-ink-700 hover:border-brand-200"
          >
            About {SITE_NAME}
          </Link>
        </div>
      </article>

      {others.length > 0 ? (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-ink-900">More articles</h2>
          <ul className="space-y-3">
            {others.map((a) => (
              <li key={a.slug}>
                <Link
                  to={a.path}
                  className="block rounded-xl border border-ink-100 bg-white px-5 py-4 text-sm font-semibold text-ink-800 transition hover:border-brand-200 hover:text-brand-800"
                >
                  {a.h1}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </StaticPageShell>
  );
}
