# PDFCropper

Free, client-side PDF cropping tool built with React and Vite. PDFs are processed entirely in the browser — nothing is uploaded to a server.

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Project structure

```
src/
  App.jsx                 # routes, Suspense, ErrorBoundary
  components/
    ErrorBoundary.jsx
    layout/               # Header, Footer
  constants/              # shared limits and contact email
  features/crop/          # crop feature (UI, hooks, utils)
  lib/pdf/worker.js       # local pdf.js worker (no CDN)
  pages/                  # Landing, Guide, legal, Tools, 404
```

## Notes

- Update `CONTACT_EMAIL` in `src/constants/index.js` for the contact form.
- Max PDF size for browser processing is 25 MB (configurable in constants).
