import { useLayoutEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';

const RESIZE_HANDLES = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];

function handleStyle(position) {
  return {
    cursor: `${position}-resize`,
    ...(position.includes('n') && { top: '-7px' }),
    ...(position.includes('s') && { bottom: '-7px' }),
    ...(position.includes('w') && { left: '-7px' }),
    ...(position.includes('e') && { right: '-7px' }),
    ...(position === 'n' && { left: '50%', transform: 'translateX(-50%)' }),
    ...(position === 's' && { left: '50%', transform: 'translateX(-50%)' }),
    ...(position === 'w' && { top: '50%', transform: 'translateY(-50%)' }),
    ...(position === 'e' && { top: '50%', transform: 'translateY(-50%)' }),
  };
}

export default function CropPage({
  fileUrl,
  numPages,
  currentPage,
  scale,
  isDocumentLoading,
  documentError,
  cropArea,
  clearCrop,
  containerRef,
  onDocumentLoadSuccess,
  onDocumentLoadError,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  beginResize,
  onZoomIn,
  onZoomOut,
  onPrevPage,
  onNextPage,
  onDownload,
  onClearFile,
  isDownloading,
}) {
  const [containerWidth, setContainerWidth] = useState(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  const pageWidth = containerWidth ? containerWidth * scale : undefined;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onZoomOut}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            aria-label="Zoom out"
          >
            Zoom Out
          </button>
          <span className="text-sm text-slate-500 font-medium min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            aria-label="Zoom in"
          >
            Zoom In
          </button>

          {numPages > 0 && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
                aria-label="Previous page"
              >
                Prev
              </button>
              <span className="text-sm text-slate-600 font-medium tabular-nums">
                {currentPage} / {numPages}
              </span>
              <button
                type="button"
                onClick={onNextPage}
                disabled={currentPage >= numPages}
                className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClearFile}
            className="px-3.5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            New File
          </button>
          {cropArea && (
            <button
              type="button"
              onClick={clearCrop}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-red-600 bg-white border border-slate-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
              title="Deselect selection (Esc)"
            >
              Clear Selection (Esc)
            </button>
          )}
          <button
            type="button"
            onClick={onDownload}
            disabled={!cropArea || isDownloading}
            className="bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-700 transition-colors duration-200 shadow-sm"
          >
            {isDownloading ? 'Processing…' : 'Download Cropped PDF'}
          </button>
        </div>
      </div>

      <p className="px-4 py-2 text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
        Draw a crop box on this page. The same relative crop is applied to every page on download.
      </p>

      <div className="relative overflow-auto bg-slate-100 p-8 flex justify-center max-h-[80vh]">
        <div
          ref={containerRef}
          className="relative inline-block w-full cursor-crosshair select-none"
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        >
          {documentError ? (
            <div className="bg-white rounded-lg border border-red-200 p-8 text-center max-w-md mx-auto">
              <p className="text-red-700 font-medium mb-4">{documentError}</p>
              <button
                type="button"
                onClick={onClearFile}
                className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600"
              >
                Choose another file
              </button>
            </div>
          ) : !fileUrl ? (
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
                <div className="relative shadow-md bg-white flex justify-center">
                  {cropArea && (
                    <div
                      className="absolute inset-0 bg-black/10 z-10 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}
                  <Page
                    pageNumber={currentPage}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="bg-white"
                    width={pageWidth}
                  />
                </div>
              )}
            </Document>
          )}

          {cropArea && !documentError && (
            <>
              <div
                className="absolute inset-0 bg-black/30 z-10 cursor-crosshair"
                onClick={(e) => {
                  e.stopPropagation();
                  clearCrop();
                }}
                aria-hidden="true"
              />
              <div
                className="absolute border-2 border-teal-500 cursor-move"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
                  zIndex: 20,
                }}
              >
                {RESIZE_HANDLES.map((position) => (
                  <div
                    key={position}
                    role="button"
                    tabIndex={-1}
                    aria-label={`Resize crop ${position}`}
                    className="absolute w-3.5 h-3.5 bg-teal-700 border border-white rounded-full transition-transform hover:scale-125 shadow-md"
                    onMouseDown={(e) => beginResize(e, position, false)}
                    onTouchStart={(e) => beginResize(e, position, true)}
                    style={handleStyle(position)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
