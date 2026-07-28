import { Link } from 'react-router-dom';

const tools = [
  {
    title: 'Crop PDF',
    description: 'Trim margins or focus on a region. Runs entirely in your browser.',
    to: '/crop',
    cta: 'Open Crop Tool',
  },
];

export default function Tools() {
  return (
    <div className="bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Tools</h1>
          <p className="text-slate-600">
            Free, client-side PDF utilities. More tools may be added over time.
          </p>
        </div>

        <div className="grid gap-6">
          {tools.map((tool) => (
            <div
              key={tool.to}
              className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-1">{tool.title}</h2>
                <p className="text-slate-600 text-sm">{tool.description}</p>
              </div>
              <Link
                to={tool.to}
                className="shrink-0 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                {tool.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
