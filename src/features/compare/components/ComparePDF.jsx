import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../lib/pdf/worker';
import { useComparePdf } from '../hooks/useComparePdf';
import CompareUpload from './CompareUpload';
import CompareWorkspace from './CompareWorkspace';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';

const STEPS = [
  { n: '1', title: 'Upload both', text: 'Original and revised PDF versions' },
  { n: '2', title: 'Compare', text: 'Side-by-side, overlay, or text diff' },
  { n: '3', title: 'Spot changes', text: 'Flip pages and review differences' },
];

export default function ComparePDF() {
  const [started, setStarted] = useState(false);
  const pdf = useComparePdf();

  const canCompare = Boolean(pdf.leftFile && pdf.rightFile) && !pdf.isLoading;
  const showWorkspace = started && pdf.ready;

  const handleClear = () => {
    setStarted(false);
    pdf.clearAll();
  };

  const handleCompare = () => {
    if (!canCompare) return;
    setStarted(true);
  };

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className={`mx-auto ${showWorkspace ? 'max-w-6xl' : 'max-w-3xl'}`}>
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              PDF Compare Tool
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Compare PDF online
            </h1>
            <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg">
              Show a side-by-side document comparison and easily spot changes between different
              file versions. Everything runs locally in your browser.
            </p>
          </div>

          {!showWorkspace ? (
            <>
              <CompareUpload
                leftFile={pdf.leftFile}
                rightFile={pdf.rightFile}
                onLeftChange={pdf.loadLeft}
                onRightChange={pdf.loadRight}
                onLeftDrop={pdf.acceptLeft}
                onRightDrop={pdf.acceptRight}
                onCompare={handleCompare}
                canCompare={canCompare}
                disabled={pdf.isLoading}
              />

              {pdf.isLoading ? (
                <p className="mt-4 text-center text-sm text-slate-500">Reading PDFs…</p>
              ) : null}
              {pdf.loadError ? (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                  {pdf.loadError}
                </div>
              ) : null}

              <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-6 sm:px-8">
                <h3 className="mb-5 text-center text-sm font-semibold text-slate-900 sm:text-left">
                  How it works
                </h3>
                <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {STEPS.map((step) => (
                    <li
                      key={step.n}
                      className="flex items-center gap-3 text-left sm:flex-col sm:items-start"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                        {step.n}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <CompareWorkspace
              leftFile={pdf.leftFile}
              rightFile={pdf.rightFile}
              leftUrl={pdf.leftUrl}
              rightUrl={pdf.rightUrl}
              leftPages={pdf.leftPages}
              rightPages={pdf.rightPages}
              maxPages={pdf.maxPages}
              currentPage={pdf.currentPage}
              setCurrentPage={pdf.setCurrentPage}
              scale={pdf.scale}
              setScale={pdf.setScale}
              viewMode={pdf.viewMode}
              setViewMode={pdf.setViewMode}
              overlayOpacity={pdf.overlayOpacity}
              setOverlayOpacity={pdf.setOverlayOpacity}
              isLoading={pdf.isLoading}
              loadError={pdf.loadError}
              diffParts={pdf.diffParts}
              diffSummary={pdf.diffSummary}
              isDiffing={pdf.isDiffing}
              onSwap={pdf.swapFiles}
              onClear={handleClear}
            />
          )}

          <ToolSeoSection toolId="compare" accentClass="text-indigo-600" />

          <p className="mt-6 text-center text-sm text-slate-500">
            Need to merge versions?{' '}
            <Link to="/merge" className="font-medium text-indigo-600 hover:underline">
              Open Merge PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
