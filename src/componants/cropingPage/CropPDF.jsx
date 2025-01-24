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


  console.log("scale" , scale)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/pdf') {
      setFile(URL.createObjectURL(file))
      console.log("file", file)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
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
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const downloadCroppedPDF = async () => {
    if (!file || !cropArea || !containerRef.current) return;
  
    try {
      // Load the PDF
      const existingPdfBytes = await fetch(file).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const croppedPdf = await PDFDocument.create();
      const pages = pdfDoc.getPages();
  
      const { x, y, width, height } = cropArea;
      const container = containerRef.current;
      const containerWidth = container.offsetWidth; // Displayed container width
      const containerHeight = container.offsetHeight; // Displayed container height
  
      for (let i = 0; i < pages.length; i++) {
        const originalPage = pages[i];
        const [copiedPage] = await croppedPdf.copyPages(pdfDoc, [i]);
  
        const pdfWidth = originalPage.getWidth(); // Actual width of the PDF
        const pdfHeight = originalPage.getHeight(); // Actual height of the PDF
  
        // Adjust for scale
        const scaleX = pdfWidth / (containerWidth / scale); // Adjust for zoom
        const scaleY = pdfHeight / (containerHeight / scale);
  
        // Convert screen crop area to PDF crop area
        const cropBox = {
          x: x * scaleX,
          y: pdfHeight - (y + height) * scaleY, // Flip Y-axis
          width: width * scaleX,
          height: height * scaleY,
        };
  
        console.log('Crop Box:', cropBox);
  
        // Apply crop to the page
        copiedPage.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
        copiedPage.setMediaBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
  
        croppedPdf.addPage(copiedPage); // Add the cropped page
      }
  
      // Save and download the cropped PDF
      const pdfBytes = await croppedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'cropped.pdf';
      link.click();
  
      URL.revokeObjectURL(url); // Clean up
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


