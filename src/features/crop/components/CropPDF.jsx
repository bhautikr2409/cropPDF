import { useRef, useState } from 'react';
import '../../../lib/pdf/worker';
import { usePdfCrop } from '../hooks/usePdfCrop';
import { useCropSelection } from '../hooks/useCropSelection';
import { downloadCroppedPdf } from '../utils/downloadCroppedPdf';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';
import UploadPDFPage from './UploadPDFPage';
import CropPage from './CropPage';
import ToolHeading from '../../../components/tools/ToolHeading';

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
    <div className="cat-edit tool-page pb-20 pt-10 sm:pt-14">
      <div className="container mx-auto px-4">
        {!pdf.hasFile ? (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center sm:mb-10">
              <ToolHeading toolId="crop" />
              <h1 className="mb-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
                Crop PDF online
              </h1>
              <p className="mx-auto max-w-xl text-base text-ink-600 sm:text-lg">
                Trim margins or focus on a region. Everything runs locally in your browser —
                nothing is uploaded.
              </p>
            </div>
            <UploadPDFPage onFileChange={pdf.loadFile} onFileDrop={pdf.acceptFile} />
            <ToolSeoSection toolId="crop" />
          </div>
        ) : (
          <div className="mx-auto max-w-5xl">
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
            <div className="mx-auto max-w-3xl">
              <ToolSeoSection toolId="crop" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
