import React from 'react';
import { Link } from 'react-router-dom';

const Guide = () => {
  const faqs = [
    {
      q: "How does the client-side cropping engine work?",
      a: "Unlike typical online conversion utilities that upload files to backend cloud servers, PDFCropper runs entirely inside your browser's local sandbox. When you load a document, our engine compiles canvas renderings of the pages using PDF.js. When you confirm a crop selection, we alter the metadata dimensions (the MediaBox and CropBox boundaries) directly in the client file buffer using JavaScript, triggering a direct browser stream download."
    },
    {
      q: "Will cropping a PDF reduce its visual resolution or quality?",
      a: "No. Our tool does not rasterize, compress, or re-render vector paths. It merely changes the page boundary definitions (MediaBox and CropBox boundaries). The embedded elements, texts, and vector lines remain in their original native vector states, ensuring maximum output resolution."
    },
    {
      q: "Why does Google AdSense flag tool-based web applications?",
      a: "Google requires sites hosting AdSense code to supply significant, original text content (publisher content) to ensure ads can be contextually matched and to protect against accidental click behaviors. To address this, we restrict ad delivery on interactive tool workspace canvases and provide rich support pages like this documentation center."
    },
    {
      q: "What is the difference between a MediaBox and a CropBox?",
      a: "In PDF formatting specifications, the MediaBox defines the physical boundaries of the medium on which the page is to be printed (e.g. A4 size). The CropBox defines the region to which the contents of the page are to be clipped when displayed or printed. By modifying the CropBox parameters, we tell PDF readers to only show the cropped area."
    },
    {
      q: "Are my documents secure when using this tool?",
      a: "Yes, 100%. Because no file uploads occur, your documents never cross the network. This makes PDFCropper perfectly compliant with strict organizational standards, HIPAA requirements, and data governance policies."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4" id="guide-title">
            PDF Cropping Guide & FAQ
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about cropping PDF files, local browser security, and page coordinate formats.
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">How to Crop a PDF (Step-by-Step)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600 mb-4 text-lg">
                1
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2">Upload your PDF</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Click "Choose PDF file" on our home screen to select a file from your hard drive. Your file is loaded instantly in memory.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600 mb-4 text-lg">
                2
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2">Draw Crop Boundaries</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Click and drag your mouse (or drag with your finger on touchscreens) across the PDF page to select your crop region. Adjust the sizing using the corner drag handles.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600 mb-4 text-lg">
                3
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2">Download Cropped PDF</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Click "Download Cropped PDF". Our client engine crops the document metadata and compiles a download stream immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-start gap-2">
                  <span className="text-blue-500 font-bold">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <div className="text-slate-600 text-sm leading-relaxed pl-6">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Link */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white shadow-md">
          <h2 className="text-2xl font-bold mb-2">Start Cropping Your PDF Document Today</h2>
          <p className="text-blue-100 mb-6 text-sm">Experience maximum security with zero server uploads.</p>
          <Link 
            to="/crop" 
            className="inline-block bg-white text-blue-600 hover:bg-slate-50 font-bold px-6 py-3 rounded-lg transition"
          >
            Start Cropping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Guide;
