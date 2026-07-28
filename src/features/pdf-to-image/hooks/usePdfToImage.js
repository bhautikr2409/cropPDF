import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { parsePageSelection } from '../../split/utils/pageRanges';
import { exportPdfPagesAsImages, getPdfPageCount } from '../utils/pdfToImage';

export const PAGE_SCOPE = {
  ALL: 'all',
  SELECTED: 'selected',
};

export function usePdfToImage() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [scope, setScope] = useState(PAGE_SCOPE.ALL);
  const [rangeInput, setRangeInput] = useState('');
  const [formatId, setFormatId] = useState('png');
  const [scaleId, setScaleId] = useState('high');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (!file) {
      setPageCount(0);
      setLoadError(null);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    getPdfPageCount(file).then((count) => {
      if (cancelled) return;
      setIsLoading(false);
      if (count == null || count < 1) {
        setLoadError('Could not read this PDF. It may be damaged or password-protected.');
        setPageCount(0);
        toast.error('Could not read this PDF.');
        return;
      }
      setPageCount(count);
      setRangeInput(count > 1 ? `1-${count}` : '1');
      setScope(PAGE_SCOPE.ALL);
      setFormatId('png');
      setScaleId('high');
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  const loadFile = useCallback((event) => {
    const selected = event?.target?.files?.[0];
    if (!validatePdfFile(selected)) {
      if (event?.target) event.target.value = '';
      return;
    }
    setFile(selected);
  }, []);

  const acceptFile = useCallback((selected) => {
    if (!validatePdfFile(selected)) return;
    setFile(selected);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setPageCount(0);
    setLoadError(null);
    setScope(PAGE_SCOPE.ALL);
    setRangeInput('');
    setProgress({ current: 0, total: 0 });
  }, []);

  const runExport = useCallback(async () => {
    if (!file || pageCount < 1) {
      toast.error('Upload a PDF first.');
      return;
    }

    let pages;
    if (scope === PAGE_SCOPE.ALL) {
      pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    } else {
      const parsed = parsePageSelection(rangeInput, pageCount);
      if (parsed.error) {
        toast.error(parsed.error);
        return;
      }
      pages = parsed.pages;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: pages.length });
    try {
      await exportPdfPagesAsImages(file, pages, {
        formatId,
        scaleId,
        onProgress: (current, total) => setProgress({ current, total }),
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, formatId, pageCount, rangeInput, scaleId, scope]);

  return {
    file,
    pageCount,
    isLoading,
    loadError,
    scope,
    setScope,
    rangeInput,
    setRangeInput,
    formatId,
    setFormatId,
    scaleId,
    setScaleId,
    isProcessing,
    progress,
    loadFile,
    acceptFile,
    clearFile,
    runExport,
  };
}
