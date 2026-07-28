import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { parsePageSelection, parseRangeGroups } from '../utils/pageRanges';
import {
  extractPagesToPdf,
  getPdfPageCount,
  splitByRanges,
  splitEveryPage,
} from '../utils/splitPdfs';

export const SPLIT_MODES = {
  EXTRACT: 'extract',
  EVERY_PAGE: 'every-page',
  RANGES: 'ranges',
};

/**
 * Manages split PDF file lifecycle, mode, range input, and export.
 */
export function useSplitPdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [mode, setMode] = useState(SPLIT_MODES.EXTRACT);
  const [rangeInput, setRangeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
    setMode(SPLIT_MODES.EXTRACT);
  }, []);

  const acceptFile = useCallback((selected) => {
    if (!validatePdfFile(selected)) return;
    setFile(selected);
    setMode(SPLIT_MODES.EXTRACT);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setPageCount(0);
    setLoadError(null);
    setRangeInput('');
    setMode(SPLIT_MODES.EXTRACT);
  }, []);

  const runSplit = useCallback(async () => {
    if (!file || pageCount < 1) {
      toast.error('Upload a PDF first.');
      return;
    }

    setIsProcessing(true);
    try {
      if (mode === SPLIT_MODES.EVERY_PAGE) {
        await splitEveryPage(file, pageCount);
        return;
      }

      if (mode === SPLIT_MODES.EXTRACT) {
        const { pages, error } = parsePageSelection(rangeInput, pageCount);
        if (error) {
          toast.error(error);
          return;
        }
        await extractPagesToPdf(file, pages);
        return;
      }

      if (mode === SPLIT_MODES.RANGES) {
        const { ranges, error } = parseRangeGroups(rangeInput, pageCount);
        if (error) {
          toast.error(error);
          return;
        }
        await splitByRanges(file, ranges);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [file, mode, pageCount, rangeInput]);

  return {
    file,
    pageCount,
    isLoading,
    loadError,
    mode,
    setMode,
    rangeInput,
    setRangeInput,
    isProcessing,
    loadFile,
    acceptFile,
    clearFile,
    runSplit,
  };
}
