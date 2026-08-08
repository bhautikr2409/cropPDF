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
    </>
  );
}
