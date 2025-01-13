import { useState, useRef } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import { PDFDocument} from 'pdf-lib';
import '@react-pdf-viewer/core/lib/styles/index.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function CropPDF() {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(" ")
  const [pageNumber, setPageNumber] = useState(1)
  const [cropArea, setCropArea] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/pdf') {
      setFile(URL.createObjectURL(file))
      console.log("1 pdf")
      console.log("file", file)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    console.log("2 pdf")
  }

  const handleMouseDown = (e) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDragging(true)
    setStartPoint({ x, y })
    setCropArea({ x, y, width: 0, height: 0 })

    console.log("3 pdf")
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    setCropArea({
      x: Math.min(startPoint.x, currentX),
      y: Math.min(startPoint.y, currentY),
      width: Math.abs(currentX - startPoint.x),
      height: Math.abs(currentY - startPoint.y)
    })
    console.log("4 pdf")
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    console.log("5 pdf")
  }

  // const downloadCroppedPDF = () => {
  //   // Here you would implement the PDF cropping and downloading logic
  //   console.log("this is crop")
  //   console.log('Downloading cropped PDF with area:', cropArea)
  // }



  const downloadCroppedPDF = async () => {
    if (!file || !cropArea) return;
  
    try {
      // Fetch the original PDF file
      const existingPdfBytes = await fetch(file).then((res) => res.arrayBuffer());
  
      // Load the original PDF
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
      // Create a new PDF for cropped pages
      const croppedPdf = await PDFDocument.create();
  
      const pages = pdfDoc.getPages();
      const { x, y, width, height } = cropArea;
  
      for (let i = 0; i < pages.length; i++) {
        const originalPage = pages[i];
  
        // Copy the page into the new PDF
        const [copiedPage] = await croppedPdf.copyPages(pdfDoc, [i]);
  
        // Get the original page dimensions
        const originalPageWidth = originalPage.getWidth();
        const originalPageHeight = originalPage.getHeight();
  
        // Adjust the crop area to PDF coordinates (bottom-left origin)
        const cropBox = {
          x: x,
          y: originalPageHeight - y - height, // Convert to PDF coordinate system
          width: width,
          height: height,
        };
  
        // Apply the crop box
        copiedPage.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
  
        // Add the cropped page to the new PDF
        croppedPdf.addPage(copiedPage);
      }
  
      // Serialize the cropped PDF and create a Blob
      const pdfBytes = await croppedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
      // Trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'cropped.pdf';
      link.click();
  
      console.log('Cropped PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading cropped PDF:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {!file ? (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-3 text-slate-800">Upload PDF to Crop</h2>
                <p className="text-slate-600">Select a PDF file to start cropping</p>
              </div>
              <label className="cursor-pointer inline-flex items-center justify-center px-8 py-4 border-2 border-dashed border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-blue-600 font-medium">Choose PDF file</span>
              </label>
            </div>
          ) : (
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
                {/* <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                  <div className="flex flex-col gap-8 p-6">
                    {Array.from(new Array(numPages), (el, index) => (
                      <div key={`page_${index + 1}`} className="shadow-lg">
                        <Page
                          pageNumber={index + 1}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </Document> */}


<Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
  <div className="flex flex-col gap-8 p-6">
    {Array.from(new Array(numPages), (el, index) => (
      <div key={`page_${index + 1}`} className="relative shadow-lg">
        {/* Render the dark overlay only on the page */}
        {cropArea && (
          <div
            className="absolute bg-black/10"
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
          className="bg-white"
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
          )}
        </div>
      </div>
    </div>
  )
}

