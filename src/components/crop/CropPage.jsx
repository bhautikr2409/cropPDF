import React, { useState, useLayoutEffect } from 'react';
import { Document, Page } from 'react-pdf';

const CropPage = ({ 
  onDocumentLoadSuccess,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  downloadCroppedPDF,
  cropArea,
  setCropArea, // Receive setCropArea to update resize bounds
  containerRef,
  file,
  numPages,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  handleZoomOut,
  handleZoomIn,
  scale
}) => {
  const [containerWidth, setContainerWidth] = useState(null);

  // Monitor the parent container width responsively
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [containerRef]);

  // Handle resizing mouse events for the crop handles
  const handleResizeMouseDown = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    if (!cropArea || !containerRef.current) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startArea = { ...cropArea };
    const containerRect = containerRef.current.getBoundingClientRect();

    const handleResizeMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const newArea = { ...startArea };

      if (direction.includes('e')) {
        newArea.width = Math.max(10, Math.min(startArea.width + deltaX, containerRect.width - startArea.x));
      }
      if (direction.includes('s')) {
        newArea.height = Math.max(10, Math.min(startArea.height + deltaY, containerRect.height - startArea.y));
      }
      if (direction.includes('w')) {
        const allowedDelta = Math.max(-startArea.x, Math.min(deltaX, startArea.width - 10));
        newArea.x = startArea.x + allowedDelta;
        newArea.width = startArea.width - allowedDelta;
      }
      if (direction.includes('n')) {
        const allowedDelta = Math.max(-startArea.y, Math.min(deltaY, startArea.height - 10));
        newArea.y = startArea.y + allowedDelta;
        newArea.height = startArea.height - allowedDelta;
      }

      setCropArea(newArea);
    };

    const handleResizeMouseUp = () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };

    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  };

  // Handle touch-drag resize for mobile devices
  const handleResizeTouchStart = (e, direction) => {
    e.stopPropagation();
    if (!cropArea || !containerRef.current) return;

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startArea = { ...cropArea };
    const containerRect = containerRef.current.getBoundingClientRect();

    const handleResizeTouchMove = (moveEvent) => {
      const moveTouch = moveEvent.touches[0];
      const deltaX = moveTouch.clientX - startX;
      const deltaY = moveTouch.clientY - startY;
      const newArea = { ...startArea };

      if (direction.includes('e')) {
        newArea.width = Math.max(10, Math.min(startArea.width + deltaX, containerRect.width - startArea.x));
      }
      if (direction.includes('s')) {
        newArea.height = Math.max(10, Math.min(startArea.height + deltaY, containerRect.height - startArea.y));
      }
      if (direction.includes('w')) {
        const allowedDelta = Math.max(-startArea.x, Math.min(deltaX, startArea.width - 10));
        newArea.x = startArea.x + allowedDelta;
        newArea.width = startArea.width - allowedDelta;
      }
      if (direction.includes('n')) {
        const allowedDelta = Math.max(-startArea.y, Math.min(deltaY, startArea.height - 10));
        newArea.y = startArea.y + allowedDelta;
        newArea.height = startArea.height - allowedDelta;
      }

      setCropArea(newArea);
    };

    const handleResizeTouchEnd = () => {
      document.removeEventListener('touchmove', handleResizeTouchMove);
      document.removeEventListener('touchend', handleResizeTouchEnd);
    };

    document.addEventListener('touchmove', handleResizeTouchMove, { passive: false });
    document.addEventListener('touchend', handleResizeTouchEnd);
  };

  const parsedNumPages = typeof numPages === 'number' ? numPages : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            aria-label="Zoom Out"
          >
            Zoom Out
          </button>
          <span className="text-sm text-slate-500 font-medium">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            aria-label="Zoom In"
          >
            Zoom In
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {cropArea && (
            <button
              onClick={() => setCropArea(null)}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-red-600 bg-white border border-slate-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
              title="Deselect selection (Esc)"
            >
              Clear Selection (Esc)
            </button>
          )}
          <button
            onClick={downloadCroppedPDF}
            disabled={!cropArea}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors duration-200 shadow-sm"
          >
            Download Cropped PDF
          </button>
        </div>
      </div>

      {/* PDF viewport and canvas selection area */}
      <div className="relative overflow-auto bg-slate-100 p-8 flex justify-center max-h-[80vh]">
        <div
          ref={containerRef}
          className="relative inline-block w-full cursor-crosshair select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <div className="flex flex-col gap-8 w-full items-center">
              {Array.from(new Array(parsedNumPages), (el, index) => (
                <div key={`page_${index + 1}`} className="relative shadow-md bg-white p-0 m-0 border-0 flex justify-center">
                  {cropArea && (
                    <div
                      className="absolute bg-black/10 transition-colors"
                      style={{
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="bg-white p-0 m-0 border-0"
                    scale={scale}
                    width={containerWidth || undefined}
                  />
                </div>
              ))}
            </div>
          </Document>

          {/* Selection Box Overlay */}
          {cropArea && (
            <>
              {/* Click outside backdrop to deselect */}
              <div 
                className="absolute inset-0 bg-black/30 z-10 cursor-crosshair" 
                onClick={(e) => {
                  e.stopPropagation();
                  setCropArea(null);
                }}
              />
              <div
                className="absolute border-2 border-blue-500 shadow-lg cursor-move"
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
                {/* Visual Resize Handles */}
                {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map((position) => (
                  <div
                    key={position}
                    className="absolute w-3.5 h-3.5 bg-blue-600 border border-white rounded-full transition-transform hover:scale-125 shadow-md"
                    onMouseDown={(e) => handleResizeMouseDown(e, position)}
                    onTouchStart={(e) => handleResizeTouchStart(e, position)}
                    style={{
                      cursor: `${position}-resize`,
                      ...(position.includes('n') && { top: '-7px' }),
                      ...(position.includes('s') && { bottom: '-7px' }),
                      ...(position.includes('w') && { left: '-7px' }),
                      ...(position.includes('e') && { right: '-7px' }),
                      ...(position === 'n' && { left: '50%', transform: 'translateX(-50%)' }),
                      ...(position === 's' && { left: '50%', transform: 'translateX(-50%)' }),
                      ...(position === 'w' && { top: '50%', transform: 'translateY(-50%)' }),
                      ...(position === 'e' && { top: '50%', transform: 'translateY(-50%)' })
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropPage;


