/**
 * Writes public/sitemap.xml from path: '...' entries in seoContent.js.
 * Run: node scripts/generate-sitemap.mjs (also hooked as prebuild).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SITE_URL = 'https://croppdf.netlify.app';

const seoSource = readFileSync(join(root, 'src/constants/seoContent.js'), 'utf8');
const paths = [
  ...new Set(
    [...seoSource.matchAll(/path:\s*'(\/[^']*)'/g)]
      .map((m) => m[1])
      .filter((p) => p && p !== '/404')
  ),
];

// Stable ordering: home → tools → tools alpha → static pages
const staticTail = [
  '/guide',
  '/resources',
  '/resources/why-browser-pdf-tools',
  '/resources/meesho-flipkart-label-printing',
  '/resources/compress-merge-split-everyday',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];
const ranked = [
  '/',
  '/tools',
  ...paths
    .filter((p) => p !== '/' && p !== '/tools' && !staticTail.includes(p))
    .sort(),
  ...staticTail.filter((p) => paths.includes(p)),
];

const PRIORITY = {
  '/': '1.0',
  '/tools': '0.9',
  '/merge': '0.9',
  '/split': '0.9',
  '/compress': '0.9',
  '/crop': '0.9',
};

const CHANGEFREQ = {
  '/': 'weekly',
  '/tools': 'weekly',
  '/guide': 'monthly',
  '/resources': 'weekly',
  '/about': 'monthly',
  '/contact': 'monthly',
  '/privacy': 'yearly',
  '/terms': 'yearly',
};

const urls = ranked
  .map((path) => {
    const loc = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
    const changefreq = CHANGEFREQ[path] || 'weekly';
    const priority =
      PRIORITY[path] ||
      (path.includes('markdown') ? '0.7' : staticTail.includes(path) ? '0.5' : '0.8');
    return `  <url><loc>${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const out = join(root, 'public/sitemap.xml');
writeFileSync(out, xml, 'utf8');
console.log(`sitemap.xml updated (${ranked.length} URLs) → ${out}`);
