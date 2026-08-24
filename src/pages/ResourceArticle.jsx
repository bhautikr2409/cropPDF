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

      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-teal-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/resources" className="hover:text-teal-700">
          Resources
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{article.category}</span>
      </nav>

      <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold text-teal-700">{article.category}</p>
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {article.h1}
        </h1>
        <p className="mb-2 text-lg leading-relaxed text-slate-600">{article.summary}</p>
        <p className="mb-8 text-xs text-slate-500">
          Published {article.published} · Updated {article.updated}
        </p>

        <div className="space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-xl font-bold text-slate-900">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="mb-3 text-[15px] leading-relaxed text-slate-600 last:mb-0">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-slate-100 pt-8">
          <Link
            to="/tools"
            className="inline-flex h-10 items-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-600"
          >
            Try PDF tools
          </Link>
          <Link
            to="/guide"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-teal-200"
          >
            Help Guide
          </Link>
          <Link
            to="/about"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-teal-200"
          >
            About {SITE_NAME}
          </Link>
        </div>
      </article>

      {others.length > 0 ? (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-slate-900">More articles</h2>
          <ul className="space-y-3">
            {others.map((a) => (
              <li key={a.slug}>
                <Link
                  to={a.path}
                  className="block rounded-xl border border-slate-100 bg-white px-5 py-4 text-sm font-semibold text-slate-800 transition hover:border-teal-200 hover:text-teal-800"
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
