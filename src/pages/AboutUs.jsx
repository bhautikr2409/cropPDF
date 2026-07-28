import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight mb-4" id="about-title">
            About PDFCropper
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Providing lightning-fast, highly secure, and accessible PDF editing tools directly inside your web browser.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-12 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12">
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Many online PDF services require you to upload your personal documents to remote servers. This introduces 
                significant privacy issues and security vulnerabilities, exposing sensitive files to potential data leaks.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our mission is to eliminate that risk. By building cutting-edge, client-side browser utilities, we ensure 
                that your document edits are processed locally. Your files never leave your computer.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Why Choose Us?</h3>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span><strong>100% Client-Side:</strong> Zero uploads, keeping documents private.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span><strong>No Signup Required:</strong> Immediate access, no email needed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span><strong>Lightning Fast:</strong> Rendering powered by WebAssembly and local JS.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span><strong>Precise Margins:</strong> Easy visual bounds box dragging and resizing.</span>
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Technology section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">How it Works under the Hood</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              PDFCropper is built on modern web standards. When you select a PDF file, our interface reads the binary payload into 
              browser memory as a Blob URL. We then employ <code>pdfjs-dist</code> to render individual pages onto high-definition 
              HTML5 canvas objects.
            </p>
            <p className="text-slate-600 leading-relaxed">
              When you highlight your desired crop box, we map those display coordinates to the physical page dimensions. 
              Finally, we use <code>pdf-lib</code> to load the original document, modify the page parameters (specifically, the 
              <code>CropBox</code> and <code>MediaBox</code> coordinates), compile the changes, and compile a local download 
              stream immediately. The server simply serves static JS files; the client does all the heavy lifting.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Call to action */}
          <div className="text-center pt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Ready to crop your document?</h3>
            <Link 
              to="/crop" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Get Started Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
