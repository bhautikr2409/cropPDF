import { Link } from 'react-router-dom';
import { useSplitPdf } from '../hooks/useSplitPdf';
import SplitUpload from './SplitUpload';
import SplitWorkspace from './SplitWorkspace';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Choose a PDF to split' },
  { n: '2', title: 'Choose mode', text: 'Extract, every page, or ranges' },
  { n: '3', title: 'Download', text: 'Get PDF or ZIP results' },
];

export default function SplitPDF() {
  const {
    file,
    pageCount,
    isLoading,
    loadError,
    mode,
    setMode,
    rangeInput,
    setRangeInput,
    isProcessing,
    loadFile,
    acceptFile,
    clearFile,
    runSplit,
  } = useSplitPdf();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-orange-600 mb-2 tracking-wide uppercase">
              PDF Split Tool
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Split PDF online
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
              Extract pages or split a document into separate PDFs. Everything runs locally
              in your browser — nothing is uploaded.
            </p>
          </div>

          {!file ? (
            <>
              <SplitUpload
                onFileChange={loadFile}
                onFileDrop={acceptFile}
                disabled={isProcessing}
              />

              <div className="mt-10 rounded-2xl bg-white border border-slate-200 px-6 py-6 sm:px-8">
                <h3 className="text-sm font-semibold text-slate-900 mb-5 text-center sm:text-left">
                  How it works
                </h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {STEPS.map((step) => (
                    <li
                      key={step.n}
                      className="flex sm:flex-col items-center sm:items-start gap-3 text-left"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white text-sm font-bold">
                        {step.n}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <SplitWorkspace
              file={file}
              pageCount={pageCount}
              isLoading={isLoading}
              loadError={loadError}
              mode={mode}
              setMode={setMode}
              rangeInput={rangeInput}
              setRangeInput={setRangeInput}
              isProcessing={isProcessing}
              onClear={clearFile}
              onSplit={runSplit}
            />
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Need to combine files?{' '}
            <Link to="/merge" className="text-orange-600 font-medium hover:underline">
              Open Merge PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
