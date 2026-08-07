import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CookieConsent from './components/layout/CookieConsent';
import LandingPage from './pages/LandingPage';

const CropPDF = lazy(() => import('./features/crop'));
const MergePDF = lazy(() => import('./features/merge'));
const SplitPDF = lazy(() => import('./features/split'));
const CompressPDF = lazy(() => import('./features/compress'));
const RotatePDF = lazy(() => import('./features/rotate'));
const PdfToImage = lazy(() => import('./features/pdf-to-image'));
const ImageToPdf = lazy(() => import('./features/image-to-pdf'));
const PdfToMarkdown = lazy(() => import('./features/pdf-to-markdown'));
const MarkdownToPdf = lazy(() => import('./features/markdown-to-pdf'));
const ProtectPDF = lazy(() => import('./features/protect'));
const UnlockPDF = lazy(() => import('./features/unlock'));
const EditPDF = lazy(() => import('./features/edit'));
const ComparePDF = lazy(() => import('./features/compare'));
const OrganizePDF = lazy(() => import('./features/organize'));
const LabelCropPDF = lazy(() => import('./features/label-crop'));
const Tools = lazy(() => import('./pages/Tools'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Guide = lazy(() => import('./pages/Guide'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-sm text-slate-500">
      <span className="inline-flex items-center gap-2">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
        Loading…
      </span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-[var(--page-bg)] text-slate-800 antialiased">
          <Toaster position="top-center" />
          <Header />

          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/crop" element={<CropPDF />} />
                <Route path="/merge" element={<MergePDF />} />
                <Route path="/split" element={<SplitPDF />} />
                <Route path="/compress" element={<CompressPDF />} />
                <Route path="/rotate" element={<RotatePDF />} />
                <Route path="/pdf-to-image" element={<PdfToImage />} />
                <Route path="/image-to-pdf" element={<ImageToPdf />} />
                <Route path="/pdf-to-markdown" element={<PdfToMarkdown />} />
                <Route path="/markdown-to-pdf" element={<MarkdownToPdf />} />
                <Route path="/protect" element={<ProtectPDF />} />
                <Route path="/unlock" element={<UnlockPDF />} />
                <Route path="/edit" element={<EditPDF />} />
                <Route path="/compare" element={<ComparePDF />} />
                <Route path="/organize" element={<OrganizePDF />} />
                <Route path="/label-crop" element={<LabelCropPDF />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
          <CookieConsent />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
