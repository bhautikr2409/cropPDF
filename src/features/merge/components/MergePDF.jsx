import { Link } from 'react-router-dom';
import { useMergePdf } from '../hooks/useMergePdf';
import MergeUpload from './MergeUpload';
import MergeFileList from './MergeFileList';

const STEPS = [
  { n: '1', title: 'Add PDFs', text: 'Upload two or more files' },
  { n: '2', title: 'Reorder', text: 'Drag or use arrows to set order' },
  { n: '3', title: 'Merge', text: 'Download one combined PDF' },
];

export default function MergePDF() {
  const {
    files,
    isMerging,
    totalPages,
    totalBytes,
    addFiles,
    removeFile,
    clearFiles,
    moveFile,
    reorderFiles,
    mergeFiles,
  } = useMergePdf();

  return (
    <div className="bg-[#f5f7fb] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-rose-600 mb-2 tracking-wide uppercase">
              PDF Merge Tool
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Merge PDF online
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
              Combine multiple PDFs into one file, in the order you choose. Everything runs
              locally in your browser — nothing is uploaded.
            </p>
          </div>

          <MergeUpload onAddFiles={addFiles} disabled={isMerging} />

          {files.length > 0 && (
            <div className="mt-6">
              <MergeFileList
                files={files}
                onMove={moveFile}
                onRemove={removeFile}
                onReorder={reorderFiles}
                onClear={clearFiles}
                onMerge={mergeFiles}
                isMerging={isMerging}
                totalPages={totalPages}
                totalBytes={totalBytes}
              />
            </div>
          )}

          {files.length === 0 && (
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
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white text-sm font-bold">
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
            Looking for cropping?{' '}
            <Link to="/crop" className="text-rose-600 font-medium hover:underline">
              Open Crop PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
