import ToolsCatalog from '../components/tools/ToolsCatalog';
import HomeSeoContent from '../components/seo/HomeSeoContent';
import SeoHead from '../components/seo/SeoHead';
import { SITE_NAME, SITE_URL } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description:
        'Free private PDF tools that run entirely in the browser. No file uploads to servers.',
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/tools?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

/** Homepage — toolkit grid + AdSense/SEO content */
export default function LandingPage() {
  const seo = STATIC_SEO.home;

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
        jsonLd={homeJsonLd}
      />
      <ToolsCatalog showHero />
      <HomeSeoContent />
    </>
  );
}
