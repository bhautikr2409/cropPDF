# PDFCraft

Free, private PDF toolkit at [pdfcraft.aadrim.in](https://pdfcraft.aadrim.in). Built with React and Vite. PDFs are processed entirely in the browser — nothing is uploaded to a server.

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## SEO & AdSense

- Canonical domain: `https://pdfcraft.aadrim.in`
- Per-route meta tags via `react-helmet-async` (`src/components/seo/SeoHead.jsx`)
- Tool FAQs + article content: `src/constants/seoContent.js` + `ToolSeoSection`
- `public/robots.txt` and `public/sitemap.xml`
- Cookie notice for AdSense: `CookieConsent`

After deploy, submit the sitemap in [Google Search Console](https://search.google.com/search-console) for `pdfcraft.aadrim.in`.

## Notes

- Update `CONTACT_EMAIL` in `src/constants/index.js` for the contact form.
- Brand/domain constants live in `src/constants/site.js`.
- Max PDF size for browser processing is 25 MB (configurable in constants).
