import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { STATIC_SEO } from '../constants/seoContent';

export default function NotFound() {
  const seo = STATIC_SEO.notFound;

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[var(--page-bg)] px-4 py-16">
      <SeoHead
        title={seo.title}
        description={seo.description}
        path="/"
        noIndex
      />
      <div className="max-w-md text-center">
        <p className="mb-2 text-sm font-semibold text-brand-700">404</p>
        <h1 className="mb-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">Page not found</h1>
        <p className="mb-8 text-ink-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-xl bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Browse PDF tools
          </Link>
          <Link
            to="/guide"
            className="inline-flex h-11 items-center rounded-xl border border-ink-200 bg-white px-5 text-sm font-semibold text-ink-700 transition hover:border-brand-200 hover:bg-brand-50"
          >
            Help guide
          </Link>
        </div>
      </div>
    </div>
  );
}
