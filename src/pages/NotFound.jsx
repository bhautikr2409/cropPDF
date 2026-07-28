import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[var(--page-bg)] px-4 py-16">
      <div className="max-w-md text-center">
        <p className="mb-2 text-sm font-semibold text-teal-700">404</p>
        <h1 className="mb-3 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mb-8 text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Go home
          </Link>
          <Link
            to="/crop"
            className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
          >
            Crop a PDF
          </Link>
        </div>
      </div>
    </div>
  );
}
