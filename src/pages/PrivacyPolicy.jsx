import { Link } from 'react-router-dom';
import StaticPageShell from '../components/layout/StaticPageShell';

export default function PrivacyPolicy() {
  return (
    <StaticPageShell>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold text-teal-700">Legal</p>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-slate-500">Last updated: July 27, 2026</p>

        <div className="space-y-8 leading-relaxed text-slate-700">
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">1. Introduction</h2>
            <p>
              Welcome to PDFCropper. We value your privacy and are committed to protecting your
              personal data. This policy explains how we collect, use, and protect information when
              you use our client-side PDF tools.
            </p>
          </section>

          <section className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 sm:p-6">
            <h2 className="mb-2 text-xl font-bold text-teal-900">2. Zero-server file privacy</h2>
            <p className="font-medium text-teal-950">
              PDF documents are processed locally on your device with client-side libraries. Files
              are never uploaded to our servers, storage, or databases. Closing the tab or choosing
              a new file clears documents from browser memory.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">3. Information we collect</h2>
            <p className="mb-3">We collect minimal information to operate the site:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Usage data:</strong> pages visited, tool interactions, and performance.
              </li>
              <li>
                <strong>Device data:</strong> IP address, browser, OS, and language preferences.
              </li>
              <li>
                <strong>Cookies:</strong> identifiers used for analytics and advertising partners.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">4. Google AdSense & cookies</h2>
            <p className="mb-3">
              This site may use Google AdSense. Google and partners may use cookies to serve ads
              based on visits to this and other sites.
            </p>
            <p>
              You can opt out of personalized ads at{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 hover:underline"
              >
                Google Ad Settings
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">5. Data security</h2>
            <p>
              Because documents stay on your machine, they are not exposed through server
              transmission. Site traffic uses HTTPS/TLS where available.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">6. Your rights</h2>
            <p>
              Depending on your location, you may have rights to access or delete analytical data we
              hold. We do not store your PDF files, so there is no document data to retrieve or
              delete from our servers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">7. Contact</h2>
            <p>
              Questions about this policy? Visit our{' '}
              <Link to="/contact" className="font-medium text-teal-700 hover:underline">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </StaticPageShell>
  );
}
