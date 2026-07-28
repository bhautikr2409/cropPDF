import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ZOOM } from '../../../constants';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';

export function useEditPdf() {
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
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const acceptFile = useCallback((selected) => {
    if (!validatePdfFile(selected)) return;
    setFile(selected);
    setNumPages(0);
    setCurrentPage(1);
    setScale(ZOOM.DEFAULT);
    setDocumentError(null);
    setIsDocumentLoading(true);
  }, []);

  const loadFile = useCallback(
    (event) => {
      const selected = event?.target?.files?.[0];
      acceptFile(selected);
      if (event?.target) event.target.value = '';
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
    console.error(error);
    setIsDocumentLoading(false);
    setDocumentError('Could not read this PDF. It may be damaged or password-protected.');
    toast.error('Could not read this PDF.');
  }, []);

  return {
    file,
    fileUrl,
    numPages,
    currentPage,
    setCurrentPage,
    scale,
    setScale,
    isDocumentLoading,
    documentError,
    loadFile,
    acceptFile,
    clearFile,
    onDocumentLoadSuccess,
    onDocumentLoadError,
  };
}
