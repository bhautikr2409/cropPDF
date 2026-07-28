import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4" id="privacy-title">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Last Updated: July 27, 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">1. Introduction</h2>
            <p>
              Welcome to PDFCropper. We value your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and protect your information when you visit and use our client-side PDF cropping services.
            </p>
          </section>

          <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">2. Zero-Server File Privacy (Crucial)</h2>
            <p className="text-blue-950 font-medium">
              We process all PDF documents locally on your device. We use client-side libraries (like 
              <code>pdf-lib</code> and <code>react-pdf</code>) that run entirely within your web browser. 
              Your PDF files are never uploaded to any server, storage backend, or database. 
              Once you close the browser window or select a new file, all documents are completely cleared from your device's browser memory.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">3. Information We Collect</h2>
            <p className="mb-4">
              We collect minimal information to maintain site operations and deliver premium experiences:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, interaction with site tools, click maps, and load speeds.</li>
              <li><strong>Device & Network Data:</strong> IP address, browser version, operating system, and language preferences.</li>
              <li><strong>Cookies:</strong> Standard tracking identifiers used for performance monitoring and third-party advertising services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">4. Google AdSense & Cookies</h2>
            <p className="mb-4">
              This site utilizes Google AdSense to serve advertisements. Google, as a third-party vendor, uses cookies 
              to serve ads on our site based on users' visits to our site and other sites on the Internet.
            </p>
            <p>
              Google's use of advertising cookies enables it and its partners to serve ads based on your visit 
              to our site and/or other sites. Users may opt out of personalized advertising by visiting 
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-1">
                Google Ad Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">5. Data Security</h2>
            <p>
              Because your documents are processed strictly on your machine, there is no risk of document exposure during server transmission 
              or security breaches on database servers. For administrative and analytics information, we enforce encryption (HTTPS/TLS) 
              to protect network payloads.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">6. Your Rights</h2>
            <p>
              Depending on your location (e.g., European Economic Area under GDPR, or California under CCPA), 
              you have rights to access, restrict, correct, or delete any analytical data we hold. Since we store no files 
              or personal documents, we have zero file data to display or delete.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">7. Contact Information</h2>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, feel free to submit an inquiry through our 
              in-app contact page or email us at support@pdfcropper.example.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
