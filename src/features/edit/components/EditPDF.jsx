import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../lib/pdf/worker';
import { useAnnotations } from '../hooks/useAnnotations';
import { useEditPdf } from '../hooks/useEditPdf';
import { exportAnnotatedPdf } from '../utils/exportAnnotatedPdf';
import EditUpload from './EditUpload';
import EditWorkspace from './EditWorkspace';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Choose a PDF to annotate' },
  { n: '2', title: 'Edit', text: 'Add text, images, shapes, or drawings' },
  { n: '3', title: 'Download', text: 'Save your edited PDF locally' },
];

export default function EditPDF() {
  const pdf = useEditPdf();
  const {
    annotationsByPage,
    selectedId,
    setSelectedId,
    selectedAnnotation,
    tool,
    setTool,
    style,
    updateStyle,
    draft,
    getPageAnnotations,
    updateAnnotation,
    deleteSelected,
    clearPage,
    clearAll,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onAnnotationPointerDown,
    onTextDoubleClick,
    editingTextId,
    setEditingTextId,
    addImageAnnotation,
    rescaleAll,
    totalCount,
  } = useAnnotations();
  const [renderSize, setRenderSize] = useState(null);
  const prevRenderSizeRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleRenderSizeChange = useCallback((size) => {
    if (!size?.width || !size?.height) return;
    const prev = prevRenderSizeRef.current;
    if (prev && (prev.width !== size.width || prev.height !== size.height)) {
      rescaleAll(prev, size);
    }
    prevRenderSizeRef.current = size;
    setRenderSize(size);
  }, [rescaleAll]);

  const handleClear = useCallback(() => {
    clearAll();
    pdf.clearFile();
    setRenderSize(null);
    prevRenderSizeRef.current = null;
  }, [clearAll, pdf]);

  const handleExport = useCallback(async () => {
    if (!pdf.file || totalCount === 0) return;
    setIsExporting(true);
    try {
      await exportAnnotatedPdf(pdf.file, annotationsByPage, renderSize);
    } finally {
      setIsExporting(false);
    }
  }, [annotationsByPage, totalCount, pdf.file, renderSize]);

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-fuchsia-600 mb-2 tracking-wide uppercase">
              PDF Edit Tool
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Edit PDF online
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
              Add text, images, shapes, or freehand annotations. Adjust size, font, and color —
              everything stays on your device.
            </p>
          </div>

          {!pdf.file ? (
            <>
              <div className="max-w-3xl mx-auto">
                <EditUpload
                  onFileChange={pdf.loadFile}
                  onFileDrop={pdf.acceptFile}
                  disabled={isExporting}
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
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fuchsia-600 text-white text-sm font-bold">
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
              </div>
            </>
          ) : (
            <EditWorkspace
              file={pdf.file}
              fileUrl={pdf.fileUrl}
              numPages={pdf.numPages}
              currentPage={pdf.currentPage}
              setCurrentPage={pdf.setCurrentPage}
              scale={pdf.scale}
              setScale={pdf.setScale}
              isDocumentLoading={pdf.isDocumentLoading}
              documentError={pdf.documentError}
              onDocumentLoadSuccess={pdf.onDocumentLoadSuccess}
              onDocumentLoadError={pdf.onDocumentLoadError}
              onClear={handleClear}
              annotations={getPageAnnotations(pdf.currentPage)}
              draft={draft}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              selectedAnnotation={selectedAnnotation}
              tool={tool}
              setTool={setTool}
              style={style}
              updateStyle={updateStyle}
              updateAnnotation={updateAnnotation}
              deleteSelected={deleteSelected}
              clearPage={clearPage}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onAnnotationPointerDown={onAnnotationPointerDown}
              onTextDoubleClick={onTextDoubleClick}
              editingTextId={editingTextId}
              setEditingTextId={setEditingTextId}
              addImageAnnotation={addImageAnnotation}
              totalCount={totalCount}
              onExport={handleExport}
              isExporting={isExporting}
              onRenderSizeChange={handleRenderSizeChange}
            />
          )}

          <ToolSeoSection toolId="edit" accentClass="text-fuchsia-600" />

          <p className="mt-6 text-center text-sm text-slate-500">
            Need to trim margins?{' '}
            <Link to="/crop" className="text-fuchsia-600 font-medium hover:underline">
              Open Crop PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
