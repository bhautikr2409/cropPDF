import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold text-blue-600 mb-2">404</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Page not found</h1>
        <p className="text-slate-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go home
          </Link>
          <Link
            to="/crop"
            className="border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Crop a PDF
          </Link>
        </div>
      </div>
    </div>
  );
}
