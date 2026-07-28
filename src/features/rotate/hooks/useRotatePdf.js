import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { parsePageSelection } from '../../split/utils/pageRanges';
import { getPdfPageCount, rotateAndDownload } from '../utils/rotatePdf';

export const PAGE_SCOPE = {
  ALL: 'all',
  SELECTED: 'selected',
};

export const ROTATION_OPTIONS = [
  { id: 'cw90', label: '90° right', degrees: 90, hint: 'Clockwise' },
  { id: 'ccw90', label: '90° left', degrees: -90, hint: 'Counter-clockwise' },
  { id: '180', label: '180°', degrees: 180, hint: 'Upside down' },
];

/**
 * Manages rotate PDF file lifecycle, page scope, angle, and download.
 */
export function useRotatePdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [scope, setScope] = useState(PAGE_SCOPE.ALL);
  const [rangeInput, setRangeInput] = useState('');
  const [rotationId, setRotationId] = useState('cw90');
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
      setScope(PAGE_SCOPE.ALL);
      setRotationId('cw90');
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
    setRotationId('cw90');
  }, []);

  const runRotate = useCallback(async () => {
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

    const option = ROTATION_OPTIONS.find((item) => item.id === rotationId);
    if (!option) {
      toast.error('Choose a rotation angle.');
      return;
    }

    setIsProcessing(true);
    try {
      await rotateAndDownload(file, pages, option.degrees);
    } finally {
      setIsProcessing(false);
    }
  }, [file, pageCount, rangeInput, rotationId, scope]);

  return {
    file,
    pageCount,
    isLoading,
    loadError,
    scope,
    setScope,
    rangeInput,
    setRangeInput,
    rotationId,
    setRotationId,
    isProcessing,
    loadFile,
    acceptFile,
    clearFile,
    runRotate,
  };
}
