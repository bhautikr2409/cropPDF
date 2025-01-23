import { useState, useRef } from 'react'
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
  const [scale, setScale] = useState(1)
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
        const existingPdfBytes = await fetch(file).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const croppedPdf = await PDFDocument.create();
        const pages = pdfDoc.getPages();
        const { x, y, width, height } = cropArea;

        for (let i = 0; i < pages.length; i++) {
            const originalPage = pages[i];
            const [copiedPage] = await croppedPdf.copyPages(pdfDoc, [i]);

            const originalPageWidth = originalPage.getWidth();
            const originalPageHeight = originalPage.getHeight();

            const cropBox = {
                x: x / scale, 
                y: originalPageHeight - (y + height) / scale, 
                width: width / scale, 
                height: height / scale,
            };

            copiedPage.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
            croppedPdf.addPage(copiedPage);
        }

        const pdfBytes = await croppedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'cropped.pdf';
        link.click();

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading cropped PDF:', error);
    }
};

  const handleTouchStart = (e) => {
    handleMouseDown(e.touches[0]);
  };

  const handleTouchMove = (e) => {
    handleMouseMove(e.touches[0]);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            scale={scale}
            />
          )}
          
        </div>
      </div>
    </div>
  )
}


