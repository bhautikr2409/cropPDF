import { Link } from 'react-router-dom';
import { usePdfToMarkdown } from '../hooks/usePdfToMarkdown';
import PdfToMarkdownUpload from './PdfToMarkdownUpload';
import PdfToMarkdownWorkspace from './PdfToMarkdownWorkspace';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Choose a text-based PDF' },
  { n: '2', title: 'Convert', text: 'Extract pages as Markdown' },
  { n: '3', title: 'Export', text: 'Copy or download a .md file' },
];

export default function PdfToMarkdown() {
  const {
    file,
    pageCount,
    isLoading,
    loadError,
    scope,
    setScope,
    rangeInput,
    setRangeInput,
    pageBreakMode,
    setPageBreakMode,
    includeTitle,
    setIncludeTitle,
    isProcessing,
    progress,
    markdown,
    setMarkdown,
    loadFile,
    acceptFile,
    clearFile,
    runConvert,
    runDownload,
    runCopy,
  } = usePdfToMarkdown();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-cyan-600 mb-2 tracking-wide uppercase">
              PDF to Markdown
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Convert PDF to Markdown
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
              Extract text from a PDF into clean Markdown. Everything runs locally — nothing is
              uploaded.
            </p>
          </div>

          {!file ? (
            <>
              <PdfToMarkdownUpload
                onFileChange={loadFile}
                onFileDrop={acceptFile}
                disabled={isProcessing}
              />
              <div className="mt-10 rounded-2xl bg-white border border-slate-200 px-6 py-6 sm:px-8">
                <h3 className="text-sm font-semibold text-slate-900 mb-5">How it works</h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {STEPS.map((step) => (
                    <li key={step.n} className="flex sm:flex-col items-center sm:items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white text-sm font-bold">
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
            <PdfToMarkdownWorkspace
              file={file}
              pageCount={pageCount}
              isLoading={isLoading}
              loadError={loadError}
              scope={scope}
              setScope={setScope}
              rangeInput={rangeInput}
              setRangeInput={setRangeInput}
              pageBreakMode={pageBreakMode}
              setPageBreakMode={setPageBreakMode}
              includeTitle={includeTitle}
              setIncludeTitle={setIncludeTitle}
              isProcessing={isProcessing}
              progress={progress}
              markdown={markdown}
              setMarkdown={setMarkdown}
              onClear={clearFile}
              onConvert={runConvert}
              onDownload={runDownload}
              onCopy={runCopy}
            />
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Need images instead?{' '}
            <Link to="/pdf-to-image" className="text-cyan-600 font-medium hover:underline">
              Open PDF to Image
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
