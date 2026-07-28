import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Logo & Privacy Disclaimer */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
              <span className="text-lg font-bold">PDFCropper</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              An open-source, 100% client-side PDF cropping tool. Your documents never touch any server. All processing happens in browser sandbox memory.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Product</h4>
            <Link to="/crop" className="hover:text-white transition-colors text-sm">Crop PDF Editor</Link>
            <Link to="/merge" className="hover:text-white transition-colors text-sm">Merge PDF</Link>
            <Link to="/tools" className="hover:text-white transition-colors text-sm">All Tools</Link>
            <Link to="/guide" className="hover:text-white transition-colors text-sm">How-To Guide & FAQ</Link>
          </div>

          {/* Legal Compliance */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Company & Legal</h4>
            <Link to="/about" className="hover:text-white transition-colors text-sm">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors text-sm">Contact Support</Link>
            <Link to="/privacy" className="hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors text-sm">Terms of Service</Link>
          </div>

        </div>

        <hr className="border-slate-800 my-8" />

        {/* Legal disclosures for AdSense */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} PDFCropper. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Ad Options & Cookie Settings
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
