import { Link } from 'react-router-dom';
import { usePdfToImage } from '../hooks/usePdfToImage';
import PdfToImageUpload from './PdfToImageUpload';
import PdfToImageWorkspace from './PdfToImageWorkspace';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';
import ToolHeading from '../../../components/tools/ToolHeading';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Choose a PDF to convert' },
  { n: '2', title: 'Options', text: 'Pick pages, format, and resolution' },
  { n: '3', title: 'Download', text: 'Get PNG/JPEG or a ZIP of images' },
];

export default function PdfToImage() {
  const {
    file,
    pageCount,
    isLoading,
    loadError,
    scope,
    setScope,
    rangeInput,
    setRangeInput,
    formatId,
    setFormatId,
    scaleId,
    setScaleId,
    isProcessing,
    progress,
    loadFile,
    acceptFile,
    clearFile,
    runExport,
  } = usePdfToImage();

  return (
    <div className="cat-convert tool-page pb-20 pt-10 sm:pt-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <ToolHeading toolId="pdf-to-image" />
            <h1 className="mb-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Convert PDF to images
            </h1>
            <p className="text-ink-600 max-w-xl mx-auto text-base sm:text-lg">
              Export PDF pages as PNG or JPEG. Everything runs locally — nothing is uploaded.
            </p>
          </div>

          {!file ? (
            <>
              <PdfToImageUpload
                onFileChange={loadFile}
                onFileDrop={acceptFile}
                disabled={isProcessing}
              />
              <div className="mt-10 rounded-3xl bg-white border border-ink-200 px-6 py-6 sm:px-8">
                <h3 className="text-sm font-semibold text-ink-900 mb-5">How it works</h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {STEPS.map((step) => (
                    <li key={step.n} className="flex sm:flex-col items-center sm:items-start gap-3">
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
            <PdfToImageWorkspace
              file={file}
              pageCount={pageCount}
              isLoading={isLoading}
              loadError={loadError}
              scope={scope}
              setScope={setScope}
              rangeInput={rangeInput}
              setRangeInput={setRangeInput}
              formatId={formatId}
              setFormatId={setFormatId}
              scaleId={scaleId}
              setScaleId={setScaleId}
              isProcessing={isProcessing}
              progress={progress}
              onClear={clearFile}
              onExport={runExport}
            />
          )}

          <ToolSeoSection toolId="pdf-to-image" />

          <p className="mt-6 text-center text-sm text-ink-500">
            Going the other way?{' '}
            <Link to="/image-to-pdf" className="text-accent-600 font-medium hover:underline">
              Open Image to PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
