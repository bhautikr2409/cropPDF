import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useMarkdownToPdf } from '../hooks/useMarkdownToPdf';
import MarkdownToPdfWorkspace from './MarkdownToPdfWorkspace';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';
import ToolHeading from '../../../components/tools/ToolHeading';

/** Preview fonts for the MD editor only — not loaded site-wide. */
const MARKDOWN_PREVIEW_FONTS =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Sans:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Lato:ital,wght@0,400;0,700;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,wght@0,400;0,700;1,400;1,700&display=swap';

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
    <div className="cat-convert tool-page pb-20 pt-10 sm:pt-14">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={MARKDOWN_PREVIEW_FONTS} rel="stylesheet" />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-10">
            <ToolHeading toolId="markdown-to-pdf" />
            <h1 className="mb-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Convert Markdown to PDF
            </h1>
            <p className="mx-auto max-w-xl text-base text-ink-600 sm:text-lg">
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

          <div className="mt-10 rounded-3xl border border-ink-200 bg-white px-6 py-6 sm:px-8">
            <h3 className="mb-5 text-center text-sm font-semibold text-ink-900 sm:text-left">
              How it works
            </h3>
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STEPS.map((step) => (
                <li
                  key={step.n}
                  className="flex items-center gap-3 text-left sm:flex-col sm:items-start"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-700 text-sm font-bold text-white">
                    {step.n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{step.title}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <ToolSeoSection toolId="markdown-to-pdf" />

          <p className="mt-6 text-center text-sm text-ink-500">
            Going the other way?{' '}
            <Link to="/pdf-to-markdown" className="font-medium text-accent-700 hover:underline">
              Open PDF to Markdown
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
