import { Link } from 'react-router-dom';
import { CATEGORY_BY_ID, TOOLS } from '../../constants/toolsCatalog';

/** Breadcrumb shown above a tool page's <h1>. */
export default function ToolHeading({ toolId }) {
  const tool = TOOLS.find((t) => t.id === toolId);
  if (!tool) return null;
  const category = CATEGORY_BY_ID[tool.category];

  return (
    <div className="mb-4 flex justify-center">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm font-medium text-ink-500">
          <li>
            <Link to="/tools" className="hover:text-ink-900 hover:underline">
              All tools
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/tools?q=${encodeURIComponent(category?.label || '')}`} className="text-accent-700 hover:underline">
              {category?.label}
            </Link>
          </li>
        </ol>
      </nav>
    </div>
  );
}
