import ToolsCatalog from '../components/tools/ToolsCatalog';
import SeoHead from '../components/seo/SeoHead';
import { STATIC_SEO } from '../constants/seoContent';

export default function Tools() {
  const seo = STATIC_SEO.tools;

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
      />
      <ToolsCatalog
        title="All PDF tools"
        subtitle="Free, client-side PDF utilities from PDFCraft. Your files never leave your browser."
      />
    </>
  );
}
