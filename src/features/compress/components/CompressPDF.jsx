import { Link } from 'react-router-dom';
import { useCompressPdf } from '../hooks/useCompressPdf';
import CompressUpload from './CompressUpload';
import CompressWorkspace from './CompressWorkspace';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Choose a PDF to compress' },
  { n: '2', title: 'Pick level', text: 'Extreme, Recommended, or High quality' },
  { n: '3', title: 'Download', text: 'Get a smaller compressed PDF' },
];

export default function CompressPDF() {
  const {
    file,
    pageCount,
    isLoading,
    loadError,
    level,
    setLevel,
    isProcessing,
    progress,
    lastResult,
    loadFile,
    acceptFile,
    clearFile,
    runCompress,
  } = useCompressPdf();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-emerald-600 mb-2 tracking-wide uppercase">
              PDF Compress Tool
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Compress PDF online
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
              Reduce PDF file size for sharing and storage. Everything runs locally in your
              browser — nothing is uploaded.
            </p>
          </div>

          {!file ? (
            <>
              <CompressUpload
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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
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
            <CompressWorkspace
              file={file}
              pageCount={pageCount}
              isLoading={isLoading}
              loadError={loadError}
              level={level}
              setLevel={setLevel}
              isProcessing={isProcessing}
              progress={progress}
              lastResult={lastResult}
              onClear={clearFile}
              onCompress={runCompress}
            />
          )}

          <ToolSeoSection toolId="compress" accentClass="text-emerald-600" />

          <p className="mt-6 text-center text-sm text-slate-500">
            Need to split first?{' '}
            <Link to="/split" className="text-emerald-600 font-medium hover:underline">
              Open Split PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
