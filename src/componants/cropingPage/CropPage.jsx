import React from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import '@react-pdf-viewer/core/lib/styles/index.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`


const CropPage = ({ onDocumentLoadSuccess, handleMouseDown, handleMouseMove, handleMouseUp, downloadCroppedPDF, cropArea, containerRef, file, numPages, pageNumber }) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <button
            onClick={downloadCroppedPDF}
            disabled={!cropArea}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors duration-200 shadow-sm"
          >
            Download Cropped PDF
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative cursor-crosshair overflow-hidden bg-slate-100"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >

          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <div className="flex flex-col gap-8 p-2 w-full">
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="relative shadow-lg w-full">
                  {/* Render the dark overlay only on the page */}
                  {cropArea && (
                    <div
                      className="absolute bg-black/10 "
                      style={{
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                      }}
                    />
                  )}

                  {/* Render the PDF page */}
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="bg-white w-full"
                    width={containerRef.current ? containerRef.current.clientWidth : undefined}
                  />
                </div>
              ))}
            </div>
          </Document>
          {cropArea && (
            <>
              <div className="absolute inset-0 bg-black/40 " />
              <div
                className="absolute border-2 border-blue-500"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                  backgroundColor: 'rgba(255, 236, 179, 0.3)',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Resize handles */}
                {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map((position) => (
                  <div
                    key={position}
                    className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
                    style={{
                      cursor: `${position}-resize`,
                      ...(position.includes('n') && { top: '-6px' }),
                      ...(position.includes('s') && { bottom: '-6px' }),
                      ...(position.includes('w') && { left: '-6px' }),
                      ...(position.includes('e') && { right: '-6px' }),
                      ...(position === 'n' && { left: '50%', marginLeft: '-6px' }),
                      ...(position === 's' && { left: '50%', marginLeft: '-6px' }),
                      ...(position === 'w' && { top: '50%', marginTop: '-6px' }),
                      ...(position === 'e' && { top: '50%', marginTop: '-6px' })
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CropPage
