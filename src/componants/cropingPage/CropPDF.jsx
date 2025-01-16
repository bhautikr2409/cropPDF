import { useState, useRef } from 'react'
// import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import { PDFDocument } from 'pdf-lib';
import '@react-pdf-viewer/core/lib/styles/index.css'
import UploadPDFPage from './UploadPDFPage';
import CropPage from './CropPage';

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
    console.log("1")
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
          {!file ? (<UploadPDFPage handleFileChange={handleFileChange} file={file}/>) : 
            ( <CropPage 
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            downloadCroppedPDF={downloadCroppedPDF}
            cropArea={cropArea}
            containerRef={containerRef}
            file={file}
            numPages={numPages}
            pageNumber={pageNumber}
            />
          )}
          
        </div>
      </div>
    </div>
  )
}

  