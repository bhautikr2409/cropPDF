import { Link } from 'react-router-dom';
import '../../../lib/pdf/worker';
import { useOrganizePdf } from '../hooks/useOrganizePdf';
import OrganizeUpload from './OrganizeUpload';
import OrganizeWorkspace from './OrganizeWorkspace';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Choose the PDF you want to organize' },
  { n: '2', title: 'Arrange', text: 'Reorder, delete, or add pages' },
  { n: '3', title: 'Download', text: 'Save your organized document' },
];

export default function OrganizePDF() {
  const {
    file,
    pages,
    selectedIds,
    isLoading,
    loadError,
    isProcessing,
    isInserting,
    hasChanges,
    loadFile,
    acceptFile,
    clearFile,
    toggleSelect,
    selectAll,
    clearSelection,
    removeSelected,
    removeOne,
    movePage,
    reorderPages,
    resetOrder,
    loadInsertFile,
    runOrganize,
    getPagePreviewUrl,
  } = useOrganizePdf();

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className={`mx-auto ${file ? 'max-w-6xl' : 'max-w-3xl'}`}>
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              PDF Organize Tool
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Organize PDF online
            </h1>
            <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg">
              Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to
              your document at your convenience — everything stays on your device.
            </p>
          </div>

          {!file ? (
            <>
              <OrganizeUpload
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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
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
            <OrganizeWorkspace
              file={file}
              pages={pages}
              selectedIds={selectedIds}
              isLoading={isLoading}
              loadError={loadError}
              isProcessing={isProcessing}
              isInserting={isInserting}
              hasChanges={hasChanges}
              onClear={clearFile}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
              onClearSelection={clearSelection}
              onRemoveSelected={removeSelected}
              onRemoveOne={removeOne}
              onMove={movePage}
              onReorder={reorderPages}
              onReset={resetOrder}
              onLoadInsert={loadInsertFile}
              onOrganize={runOrganize}
              getPagePreviewUrl={getPagePreviewUrl}
            />
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Need to combine whole files instead?{' '}
            <Link to="/merge" className="font-medium text-blue-600 hover:underline">
              Open Merge PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
