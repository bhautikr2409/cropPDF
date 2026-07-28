import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { ZOOM } from '../../../constants';
import { formatFileSize } from '../utils/editConstants';
import AnnotationLayer from './AnnotationLayer';
import EditToolbar from './EditToolbar';
import PropertiesPanel from './PropertiesPanel';

export default function EditWorkspace({
  file,
  fileUrl,
  numPages,
  currentPage,
  setCurrentPage,
  scale,
  setScale,
  isDocumentLoading,
  documentError,
  onDocumentLoadSuccess,
  onDocumentLoadError,
  onClear,
  annotations,
  draft,
  selectedId,
  setSelectedId,
  selectedAnnotation,
  tool,
  setTool,
  style,
  updateStyle,
  updateAnnotation,
  deleteSelected,
  clearPage,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onAnnotationPointerDown,
  onTextDoubleClick,
  editingTextId,
  setEditingTextId,
  addImageAnnotation,
  totalCount,
  onExport,
  isExporting,
  onRenderSizeChange,
}) {
  const pageWrapRef = useRef(null);
  const imageInputRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);

  useLayoutEffect(() => {
    const el = pageWrapRef.current?.parentElement;
    if (!el) return undefined;
    const updateWidth = () => setContainerWidth(el.clientWidth - 48);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fileUrl]);

  const pageWidth = containerWidth ? Math.min(containerWidth, 900) * scale : undefined;

  const reportRenderSize = useCallback(() => {
    const el = pageWrapRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const height = el.clientHeight;
    if (width > 0 && height > 0) {
      onRenderSizeChange?.({ width, height });
    }
  }, [onRenderSizeChange]);

  useEffect(() => {
    reportRenderSize();
  }, [reportRenderSize, currentPage, scale, numPages]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
        if (selectedId) {
          e.preventDefault();
          deleteSelected();
        }
      }
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteSelected, selectedId, setSelectedId]);

  const handlePickImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelected = (e) => {
    const imageFile = e.target.files?.[0];
    e.target.value = '';
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        addImageAnnotation(currentPage, reader.result);
        setTool('select');
      }
    };
    reader.readAsDataURL(imageFile);
  };

  const wrapPointer =
    (handler) => (event) => {
      handler(event, currentPage, pageWrapRef.current);
    };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900 truncate" title={file.name}>
            {file.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatFileSize(file.size)}
            {isDocumentLoading
              ? ' · Reading…'
              : numPages > 0
                ? ` · ${numPages} pages · ${totalCount} annotation${totalCount === 1 ? '' : 's'}`
                : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(ZOOM.MIN, +(s - ZOOM.STEP).toFixed(2)))}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            Zoom −
          </button>
          <span className="text-xs text-slate-500 tabular-nums min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(ZOOM.MAX, +(s + ZOOM.STEP).toFixed(2)))}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            Zoom +
          </button>
          {numPages > 0 && (
            <div className="flex items-center gap-1 ml-1 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs text-slate-600 tabular-nums px-1">
                {currentPage} / {numPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                disabled={currentPage >= numPages}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onClear}
            disabled={isExporting}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
          >
            New file
          </button>
        </div>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="sr-only"
        onChange={handleImageSelected}
      />

      <EditToolbar
        tool={tool}
        setTool={setTool}
        onPickImage={handlePickImage}
        onDelete={deleteSelected}
        onClearPage={() => clearPage(currentPage)}
        onExport={onExport}
        canExport={totalCount > 0 && !documentError && numPages > 0}
        isExporting={isExporting}
        hasSelection={Boolean(selectedId)}
      />

      {documentError ? (
        <div className="p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {documentError}
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 min-w-0 overflow-auto bg-slate-100 p-6 flex justify-center max-h-[75vh]">
            {!fileUrl ? (
              <div className="bg-white rounded-lg p-12 text-center text-slate-600 shadow-sm">
                Preparing document…
              </div>
            ) : (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="bg-white rounded-lg p-12 text-center text-slate-600 shadow-sm">
                    {isDocumentLoading ? 'Loading PDF…' : 'Preparing document…'}
                  </div>
                }
                error={
                  <div className="bg-white rounded-lg border border-red-200 p-8 text-center text-red-700">
                    Failed to load PDF.
                  </div>
                }
              >
                {numPages > 0 && (
                  <div
                    ref={pageWrapRef}
                    className="relative shadow-md bg-white inline-block"
                  >
                    <Page
                      pageNumber={currentPage}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="bg-white"
                      width={pageWidth}
                      onRenderSuccess={reportRenderSize}
                    />
                    <AnnotationLayer
                      annotations={annotations}
                      draft={draft}
                      selectedId={selectedId}
                      editingTextId={editingTextId}
                      tool={tool}
                      pageElRef={pageWrapRef}
                      onSelect={setSelectedId}
                      onUpdate={updateAnnotation}
                      onFinishEdit={() => setEditingTextId(null)}
                      onPointerDown={wrapPointer(onPointerDown)}
                      onPointerMove={wrapPointer((event, _page, el) => onPointerMove(event, el))}
                      onPointerUp={onPointerUp}
                      onAnnotationPointerDown={onAnnotationPointerDown}
                      onTextDoubleClick={onTextDoubleClick}
                    />
                  </div>
                )}
              </Document>
            )}
          </div>

          <PropertiesPanel
            style={style}
            updateStyle={updateStyle}
            selectedAnnotation={selectedAnnotation}
            updateAnnotation={updateAnnotation}
          />
        </div>
      )}

      <p className="px-4 py-2 text-xs text-slate-500 bg-slate-50 border-t border-slate-100">
        Tip: click empty space to add with the active tool. Drag any annotation to move it.
        Double-click text to edit inline. Press Delete to remove the selection.
      </p>
    </div>
  );
}
