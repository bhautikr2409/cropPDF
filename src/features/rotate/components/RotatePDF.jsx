import { Link } from 'react-router-dom';
import { useRotatePdf } from '../hooks/useRotatePdf';
import RotateUpload from './RotateUpload';
import RotateWorkspace from './RotateWorkspace';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Choose a PDF to rotate' },
  { n: '2', title: 'Choose pages', text: 'All pages or a custom range' },
  { n: '3', title: 'Rotate', text: 'Download the corrected PDF' },
];

export default function RotatePDF() {
  const {
    file,
    pageCount,
    isLoading,
    loadError,
    scope,
    setScope,
    rangeInput,
    setRangeInput,
    rotationId,
    setRotationId,
    isProcessing,
    loadFile,
    acceptFile,
    clearFile,
    runRotate,
  } = useRotatePdf();

  return (
    <div className="bg-[#f5f7fb] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-teal-600 mb-2 tracking-wide uppercase">
              PDF Rotate Tool
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Rotate PDF online
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
              Fix sideways or upside-down pages. Everything runs locally in your browser —
              nothing is uploaded.
            </p>
          </div>

          {!file ? (
            <>
              <RotateUpload
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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white text-sm font-bold">
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
            <RotateWorkspace
              file={file}
              pageCount={pageCount}
              isLoading={isLoading}
              loadError={loadError}
              scope={scope}
              setScope={setScope}
              rangeInput={rangeInput}
              setRangeInput={setRangeInput}
              rotationId={rotationId}
              setRotationId={setRotationId}
              isProcessing={isProcessing}
              onClear={clearFile}
              onRotate={runRotate}
            />
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Need to crop margins?{' '}
            <Link to="/crop" className="text-teal-600 font-medium hover:underline">
              Open Crop PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
