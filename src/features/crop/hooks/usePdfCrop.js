import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ZOOM } from '../../../constants';
import { validatePdfFile } from '../utils/validatePdfFile';

/**
 * Manages PDF file lifecycle, page count, zoom, and load/error UI state.
 *
 * Object URLs are created inside an effect keyed by the File object so React
 * Strict Mode remounts do not permanently revoke the blob before Document loads.
 */
export function usePdfCrop() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(ZOOM.DEFAULT);
  const [isDocumentLoading, setIsDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState(null);

  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setFileUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const acceptFile = useCallback((selectedFile, resetInput) => {
    if (!validatePdfFile(selectedFile)) {
      resetInput?.();
      return;
    }

    setFile(selectedFile);
    setNumPages(0);
    setCurrentPage(1);
    setScale(ZOOM.DEFAULT);
    setDocumentError(null);
    setIsDocumentLoading(true);
  }, []);

  const loadFile = useCallback(
    (event) => {
      const selectedFile = event?.target?.files?.[0];
      acceptFile(selectedFile, () => {
        if (event?.target) event.target.value = '';
      });
    },
    [acceptFile]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setNumPages(0);
    setCurrentPage(1);
    setDocumentError(null);
    setIsDocumentLoading(false);
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: total }) => {
    setNumPages(total);
    setCurrentPage(1);
    setIsDocumentLoading(false);
    setDocumentError(null);
  }, []);

  const onDocumentLoadError = useCallback((error) => {
    console.error('PDF load error:', error);
    setIsDocumentLoading(false);
    setDocumentError(
      'Could not read this PDF. The file may be damaged or password-protected.'
    );
    toast.error('Could not read this PDF.');
  }, []);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + ZOOM.STEP, ZOOM.MAX));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - ZOOM.STEP, ZOOM.MIN));
  }, []);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(numPages, p + 1));
  }, [numPages]);

  return {
    hasFile: Boolean(file),
    fileUrl,
    numPages,
    currentPage,
    scale,
    isDocumentLoading,
    documentError,
    loadFile,
    acceptFile,
    clearFile,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    zoomIn,
    zoomOut,
    goToPrevPage,
    goToNextPage,
    setCurrentPage,
  };
}
