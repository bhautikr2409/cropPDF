import { Helmet } from 'react-helmet-async';
import {
  DEFAULT_OG_IMAGE,
  LOCALE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '../../constants/site';
import { absoluteUrl } from '../../constants/seoContent';

/**
 * Per-route document head for SEO + social previews.
 */
export default function SeoHead({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
  keywords,
  noIndex = false,
  ogType = 'website',
  image = DEFAULT_OG_IMAGE,
  jsonLd,
}) {
  const canonical = absoluteUrl(path);
  const fullTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />
      <meta name="author" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="alternate" hrefLang="en" href={canonical} />
      <meta name="theme-color" content="#0f766e" />

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}

      {/* Fallback absolute URLs for crawlers */}
      <link rel="home" href={SITE_URL} />
    </Helmet>
  );
}
