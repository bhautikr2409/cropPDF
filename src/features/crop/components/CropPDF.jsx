import { useRef, useState } from 'react';
import '../../../lib/pdf/worker';
import { usePdfCrop } from '../hooks/usePdfCrop';
import { useCropSelection } from '../hooks/useCropSelection';
import { downloadCroppedPdf } from '../utils/downloadCroppedPdf';
import UploadPDFPage from './UploadPDFPage';
import CropPage from './CropPage';

export default function CropPDF() {
  const containerRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const pdf = usePdfCrop();
  const crop = useCropSelection(containerRef);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCroppedPdf({
        fileUrl: pdf.fileUrl,
        cropArea: crop.cropArea,
        containerRef,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClearFile = () => {
    crop.clearCrop();
    pdf.clearFile();
  };

  const withCropReset = (fn) => () => {
    crop.clearCrop();
    fn();
  };

  return (
    <div className="bg-[var(--page-bg)] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        {!pdf.hasFile ? (
          <div className="max-w-3xl mx-auto">
            <UploadPDFPage onFileChange={pdf.loadFile} onFileDrop={pdf.acceptFile} />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <CropPage
              fileUrl={pdf.fileUrl}
              numPages={pdf.numPages}
              currentPage={pdf.currentPage}
              scale={pdf.scale}
              isDocumentLoading={pdf.isDocumentLoading}
              documentError={pdf.documentError}
              cropArea={crop.cropArea}
              clearCrop={crop.clearCrop}
              containerRef={containerRef}
              onDocumentLoadSuccess={pdf.onDocumentLoadSuccess}
              onDocumentLoadError={pdf.onDocumentLoadError}
              onPointerDown={crop.onPointerDown}
              onPointerMove={crop.onPointerMove}
              onPointerUp={crop.onPointerUp}
              beginResize={crop.beginResize}
              onZoomIn={withCropReset(pdf.zoomIn)}
              onZoomOut={withCropReset(pdf.zoomOut)}
              onPrevPage={withCropReset(pdf.goToPrevPage)}
              onNextPage={withCropReset(pdf.goToNextPage)}
              onDownload={handleDownload}
              onClearFile={handleClearFile}
              isDownloading={isDownloading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
