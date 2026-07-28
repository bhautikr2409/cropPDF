import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm shadow-blue-500/30">
            P
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">PDFCropper</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link to="/tools" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">
            Tools
          </Link>
          <Link to="/guide" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">
            Guide & FAQ
          </Link>
          <Link to="/crop" className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm shadow-blue-500/20">
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

