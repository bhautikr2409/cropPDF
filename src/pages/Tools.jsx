import { Link } from 'react-router-dom';
import ToolsCatalog from '../components/tools/ToolsCatalog';
import SeoHead from '../components/seo/SeoHead';
import { TOOLS } from '../constants/toolsCatalog';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';

const toolsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `All PDF Tools — ${SITE_NAME}`,
  url: `${SITE_URL}/tools`,
  isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: TOOLS.filter((t) => t.available && t.to).map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.title,
      url: `${SITE_URL}${tool.to}`,
      description: tool.description,
    })),
  },
};

export default function Tools() {
  const seo = STATIC_SEO.tools;

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={toolsJsonLd}
      />
      <ToolsCatalog
        title="All PDF tools"
        subtitle="Free, client-side PDF utilities from PDFCraft. Your files never leave your browser."
      />
      <section className="border-t border-slate-200/80 bg-[var(--page-bg)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            How to choose a tool
          </h2>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>
              Use <strong className="font-semibold text-slate-800">Organize</strong> tools (merge,
              split, organize, rotate, crop) when page order or layout is the problem. Use{' '}
              <strong className="font-semibold text-slate-800">Optimize</strong> tools (compress)
              when size blocks email or uploads. Use{' '}
              <strong className="font-semibold text-slate-800">Convert</strong> tools when you need
              images or Markdown. Use <strong className="font-semibold text-slate-800">Secure</strong>{' '}
              tools to lock or unlock passwords you already know.
            </p>
            <p>
              Marketplace sellers should start with{' '}
              <Link to="/label-crop" className="font-semibold text-teal-800 hover:underline">
                Label Crop
              </Link>{' '}
              or{' '}
              <Link to="/meesho-sort" className="font-semibold text-teal-800 hover:underline">
                Sort Meesho Labels
              </Link>
              , then optionally{' '}
              <Link to="/add-logo" className="font-semibold text-teal-800 hover:underline">
                Add Logo
              </Link>{' '}
              before printing. Each tool page includes an explanation, steps, and FAQ. For longer
              guides, open the{' '}
              <Link to="/guide" className="font-semibold text-teal-800 hover:underline">
                Help Guide
              </Link>{' '}
              or{' '}
              <Link to="/resources" className="font-semibold text-teal-800 hover:underline">
                Resources
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
