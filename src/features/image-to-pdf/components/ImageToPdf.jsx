import { Link } from 'react-router-dom';
import { useImageToPdf } from '../hooks/useImageToPdf';
import ImageToPdfUpload from './ImageToPdfUpload';
import ImageToPdfList from './ImageToPdfList';

const STEPS = [
  { n: '1', title: 'Add images', text: 'Upload JPG, PNG, or WEBP files' },
  { n: '2', title: 'Reorder', text: 'Drag images into the page order' },
  { n: '3', title: 'Convert', text: 'Download a single PDF' },
];

export default function ImageToPdf() {
  const {
    files,
    pageSize,
    setPageSize,
    isProcessing,
    totalBytes,
    addFiles,
    removeFile,
    clearFiles,
    moveFile,
    reorderFiles,
    convert,
  } = useImageToPdf();

  return (
    <div className="bg-[#f5f7fb] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-indigo-600 mb-2 tracking-wide uppercase">
              Image to PDF
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Convert images to PDF
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
              Combine photos or scans into one PDF. Everything runs locally — nothing is uploaded.
            </p>
          </div>

          <ImageToPdfUpload onAddFiles={addFiles} disabled={isProcessing} />

          {files.length > 0 && (
            <div className="mt-6">
              <ImageToPdfList
                files={files}
                pageSize={pageSize}
                setPageSize={setPageSize}
                onMove={moveFile}
                onRemove={removeFile}
                onReorder={reorderFiles}
                onClear={clearFiles}
                onConvert={convert}
                isProcessing={isProcessing}
                totalBytes={totalBytes}
              />
            </div>
          )}

          {files.length === 0 && (
            <div className="mt-10 rounded-2xl bg-white border border-slate-200 px-6 py-6 sm:px-8">
              <h3 className="text-sm font-semibold text-slate-900 mb-5">How it works</h3>
              <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {STEPS.map((step) => (
                  <li key={step.n} className="flex sm:flex-col items-center sm:items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-bold">
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
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Need the reverse?{' '}
            <Link to="/pdf-to-image" className="text-indigo-600 font-medium hover:underline">
              Open PDF to Image
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
