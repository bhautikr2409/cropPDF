import { Link } from 'react-router-dom';
import { useMarkdownToPdf } from '../hooks/useMarkdownToPdf';
import MarkdownToPdfWorkspace from './MarkdownToPdfWorkspace';

const STEPS = [
  { n: '1', title: 'Add Markdown', text: 'Upload a .md file or paste content' },
  { n: '2', title: 'Preview', text: 'Check headings, lists, and code' },
  { n: '3', title: 'Download', text: 'Save a PDF on your device' },
];

export default function MarkdownToPdf() {
  const {
    mode,
    setMode,
    markdown,
    setMarkdown,
    fileMeta,
    isProcessing,
    previewTab,
    setPreviewTab,
    previewHtml,
    charCount,
    canDownload,
    typefaceId,
    setTypefaceId,
    typeface,
    loadFile,
    acceptFile,
    clearAll,
    loadSample,
    runDownload,
    formatFileSize,
  } = useMarkdownToPdf();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-lime-700">
              Markdown to PDF
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Convert Markdown to PDF
            </h1>
            <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg">
              Upload a Markdown file or paste Markdown, pick a typeface, then download a clean PDF.
              Everything runs locally in your browser.
            </p>
          </div>

          <MarkdownToPdfWorkspace
            mode={mode}
            setMode={setMode}
            markdown={markdown}
            setMarkdown={setMarkdown}
            fileMeta={fileMeta}
            isProcessing={isProcessing}
            previewTab={previewTab}
            setPreviewTab={setPreviewTab}
            previewHtml={previewHtml}
            charCount={charCount}
            canDownload={canDownload}
            typefaceId={typefaceId}
            setTypefaceId={setTypefaceId}
            typeface={typeface}
            onFileChange={loadFile}
            onFileDrop={acceptFile}
            onClear={clearAll}
            onLoadSample={loadSample}
            onDownload={runDownload}
            formatFileSize={formatFileSize}
          />

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
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-700 text-sm font-bold text-white">
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

          <p className="mt-6 text-center text-sm text-slate-500">
            Going the other way?{' '}
            <Link to="/pdf-to-markdown" className="font-medium text-lime-700 hover:underline">
              Open PDF to Markdown
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
