import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4" id="terms-title">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-8">Last Updated: July 27, 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing and using PDFCropper, you agree to comply with and be bound by these Terms of Service. 
              If you do not agree with any part of these terms, you must not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">2. Description of Service</h2>
            <p>
              PDFCropper is a free, web-based tool that allows users to crop PDF documents entirely inside their browser. 
              The application processes all document manipulations client-side via JavaScript. No documents are uploaded, processed, 
              or stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">3. Acceptable Use Policy</h2>
            <p className="mb-4">
              You agree to use PDFCropper only for lawful purposes. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the tool to process files that contain malicious code, viruses, or spyware.</li>
              <li>Attempt to reverse-engineer, disrupt, or compromise the integrity and security of the client-side scripts.</li>
              <li>Deploy automated scripts or scraping bots to interact with our user interface without our consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">4. Intellectual Property</h2>
            <p>
              All software scripts, user designs, branding, logos, and icons are the exclusive intellectual property of 
              PDFCropper and its creators. You are granted a limited, non-exclusive, non-transferable license to use the application 
              for personal or commercial PDF modifications.
            </p>
          </section>

          <section className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <h2 className="text-2xl font-bold text-amber-900 mb-3">5. Disclaimer of Warranties</h2>
            <p className="text-amber-950">
              PDFCropper is provided "as is" and "as available" without warranties of any kind, either express or implied. 
              We do not guarantee that the tool will be uninterrupted, error-free, or compatible with all PDF files or structures. 
              You assume full responsibility for validating the visual layout and content integrity of your cropped output.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">6. Limitation of Liability</h2>
            <p>
              Under no circumstances shall PDFCropper, its owners, or contributors be held liable for any direct, indirect, 
              incidental, special, or consequential damages (including data loss or document corruption) arising out of or in connection 
              with the use of our browser-based utilities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">7. Modifications to Terms</h2>
            <p>
              We reserve the right to revise these terms at any time. Any changes will be posted on this page with an updated 
              revision date. Continued use of the website after modifications indicates your acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
