import { Link } from 'react-router-dom';
import { useSplitPdf } from '../hooks/useSplitPdf';
import SplitUpload from './SplitUpload';
import SplitWorkspace from './SplitWorkspace';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';
import ToolHeading from '../../../components/tools/ToolHeading';

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
    <div className="cat-organize tool-page pb-20 pt-10 sm:pt-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <ToolHeading toolId="split" />
            <h1 className="mb-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Split PDF online
            </h1>
            <p className="text-ink-600 max-w-xl mx-auto text-base sm:text-lg">
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

              <div className="mt-10 rounded-3xl bg-white border border-ink-200 px-6 py-6 sm:px-8">
                <h3 className="text-sm font-semibold text-ink-900 mb-5 text-center sm:text-left">
                  How it works
                </h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {STEPS.map((step) => (
                    <li
                      key={step.n}
                      className="flex sm:flex-col items-center sm:items-start gap-3 text-left"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white text-sm font-bold">
                        {step.n}
                      </span>
                      <div>
                        <p className="font-semibold text-ink-900 text-sm">{step.title}</p>
                        <p className="text-xs text-ink-500 mt-0.5">{step.text}</p>
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

          <ToolSeoSection toolId="split" />

          <p className="mt-6 text-center text-sm text-ink-500">
            Need to combine files?{' '}
            <Link to="/merge" className="text-accent-600 font-medium hover:underline">
              Open Merge PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
