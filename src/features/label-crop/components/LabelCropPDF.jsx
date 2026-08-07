import { Link } from 'react-router-dom';
import '../../../lib/pdf/worker';
import { useLabelCrop } from '../hooks/useLabelCrop';
import LabelCropUpload from './LabelCropUpload';
import LabelCropWorkspace from './LabelCropWorkspace';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Flipkart or Meesho A4 label PDF' },
  { n: '2', title: 'Auto crop', text: 'Removes invoice & extra margins' },
  { n: '3', title: 'Download', text: 'Print-ready 4×6 thermal labels' },
];

export default function LabelCropPDF() {
  const {
    file,
    pageCount,
    isLoading,
    loadError,
    platformId,
    setPlatformId,
    outputSizeId,
    setOutputSizeId,
    isProcessing,
    progress,
    loadFile,
    acceptFile,
    clearFile,
    runCrop,
    formatFileSize,
  } = useLabelCrop();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-600">
              Shipping Label Crop
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Flipkart & Meesho label crop
            </h1>
            <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg">
              Upload Flipkart or Meesho A4 shipping labels — we automatically crop the label and
              prepare a 4×6 PDF for your thermal printer. Everything runs in your browser.
            </p>
          </div>

          {!file ? (
            <>
              <LabelCropUpload
                onFileChange={loadFile}
                onFileDrop={acceptFile}
                disabled={isProcessing}
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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-bold text-white">
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
            <LabelCropWorkspace
              file={file}
              pageCount={pageCount}
              isLoading={isLoading}
              loadError={loadError}
              platformId={platformId}
              setPlatformId={setPlatformId}
              outputSizeId={outputSizeId}
              setOutputSizeId={setOutputSizeId}
              isProcessing={isProcessing}
              progress={progress}
              onClear={clearFile}
              onCrop={runCrop}
              formatFileSize={formatFileSize}
            />
          )}

          <ToolSeoSection toolId="label-crop" accentClass="text-rose-600" />

          <p className="mt-6 text-center text-sm text-slate-500">
            Need a manual crop instead?{' '}
            <Link to="/crop" className="font-medium text-rose-600 hover:underline">
              Open Crop PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
