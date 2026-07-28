import StaticPageShell from '../components/layout/StaticPageShell';

export default function TermsOfService() {
  return (
    <StaticPageShell>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold text-teal-700">Legal</p>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mb-8 text-sm text-slate-500">Last updated: July 27, 2026</p>

        <div className="space-y-8 leading-relaxed text-slate-700">
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">1. Agreement to terms</h2>
            <p>
              By accessing PDFCropper, you agree to these Terms of Service. If you do not agree, do
              not use the website or tools.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">2. Description of service</h2>
            <p>
              PDFCropper provides free, browser-based PDF utilities. Document processing happens
              client-side via JavaScript. Files are not uploaded, processed, or stored on our
              servers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">3. Acceptable use</h2>
            <p className="mb-3">Use PDFCropper only for lawful purposes. You must not:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Process files that contain malware or harmful code.</li>
              <li>Attempt to disrupt or compromise the integrity of the client-side application.</li>
              <li>Use automated scraping or bots against the interface without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">4. Intellectual property</h2>
            <p>
              Software, designs, branding, and icons are the property of PDFCropper and its
              creators. You receive a limited, non-exclusive license to use the tools for personal
              or commercial PDF work.
            </p>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 sm:p-6">
            <h2 className="mb-2 text-xl font-bold text-amber-950">5. Disclaimer of warranties</h2>
            <p className="text-amber-950">
              PDFCropper is provided “as is” without warranties of any kind. We do not guarantee
              uninterrupted service or compatibility with every PDF. You are responsible for
              verifying output quality.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">6. Limitation of liability</h2>
            <p>
              PDFCropper and its contributors are not liable for damages arising from use of the
              tools, including data loss or document corruption, to the fullest extent permitted by
              law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-800">7. Changes to terms</h2>
            <p>
              We may update these terms at any time. Continued use after changes means you accept
              the revised terms.
            </p>
          </section>
        </div>
      </div>
    </StaticPageShell>
  );
}
