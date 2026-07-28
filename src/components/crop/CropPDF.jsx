import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast';
import { pdfjs } from 'react-pdf'
import { PDFDocument } from 'pdf-lib';
import '@react-pdf-viewer/core/lib/styles/index.css'
import UploadPDFPage from './UploadPDFPage';
import CropPage from './CropPage';

// Configure PDF.js worker from CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function CropPDF() {
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [cropArea, setCropArea] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const containerRef = useRef(null)

  // Revoke object URL on change/unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  // Listen for Escape key press to deselect crop selection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCropArea(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
      const url = URL.createObjectURL(selectedFile);
      setFile(url);
      setFileUrl(url);
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
      const existingPdfBytes = await fetch(file).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const croppedPdf = await PDFDocument.create();
      const pages = pdfDoc.getPages();

      const container = containerRef.current;
      const pageElements = container.querySelectorAll('.react-pdf__Page');

      const { x: cropX, y: cropY, width: cropWidth, height: cropHeight } = cropArea;

      for (let i = 0; i < pages.length; i++) {
        const originalPage = pages[i];
        const pageElement = pageElements[i] || pageElements[0];

        if (!pageElement) continue;

        // Use canvas element bounds for 1:1 pixel rendering metrics
        const canvasElement = pageElement.querySelector('canvas') || pageElement;
        const pageRect = canvasElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate offset of this page relative to container
        const pageLeft = pageRect.left - containerRect.left;
        const pageTop = pageRect.top - containerRect.top;

        // Calculate intersection of crop box with this page
        const intersectLeft = Math.max(cropX, pageLeft);
        const intersectTop = Math.max(cropY, pageTop);
        const intersectRight = Math.min(cropX + cropWidth, pageLeft + pageRect.width);
        const intersectBottom = Math.min(cropY + cropHeight, pageTop + pageRect.height);

        // Check if there is a valid crop selection on this page
        if (intersectRight > intersectLeft && intersectBottom > intersectTop) {
          const [copiedPage] = await croppedPdf.copyPages(pdfDoc, [i]);

          const mediaBox = originalPage.getMediaBox() || { x: 0, y: 0, width: originalPage.getWidth(), height: originalPage.getHeight() };
          const originX = mediaBox.x || 0;
          const originY = mediaBox.y || 0;
          const pdfWidth = mediaBox.width || originalPage.getWidth();
          const pdfHeight = mediaBox.height || originalPage.getHeight();

          const scaleX = pdfWidth / pageRect.width;
          const scaleY = pdfHeight / pageRect.height;

          // Local coordinates relative to page canvas (top-left of page)
          const localX = Math.max(0, intersectLeft - pageLeft);
          const localY = Math.max(0, intersectTop - pageTop);
          const localW = Math.min(pageRect.width - localX, intersectRight - intersectLeft);
          const localH = Math.min(pageRect.height - localY, intersectBottom - intersectTop);

          // Convert browser coordinates (0 at top) to PDF coordinates (0 at bottom)
          const pdfX = originX + localX * scaleX;
          const pdfY = originY + pdfHeight - (localY + localH) * scaleY;
          const pdfW = localW * scaleX;
          const pdfH = localH * scaleY;

          // Set exact crop boundaries on copied page
          copiedPage.setCropBox(pdfX, pdfY, pdfW, pdfH);
          copiedPage.setMediaBox(pdfX, pdfY, pdfW, pdfH);

          croppedPdf.addPage(copiedPage);
        }
      }

      if (croppedPdf.getPageCount() === 0) {
        toast.error("Please select a crop area over the PDF page.");
        return;
      }

      const pdfBytes = await croppedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'cropped.pdf';
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDF cropped and downloaded successfully!");
    } catch (error) {
      console.error('Error downloading cropped PDF:', error);
      toast.error("Failed to download cropped PDF.");
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
          {!file ? (<UploadPDFPage handleFileChange={handleFileChange} file={file} />) :
            (<CropPage
              onDocumentLoadSuccess={onDocumentLoadSuccess}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              downloadCroppedPDF={downloadCroppedPDF}
              cropArea={cropArea}
              setCropArea={setCropArea}
              containerRef={containerRef}
              file={file}
              numPages={numPages}
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


