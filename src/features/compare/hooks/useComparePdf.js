import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ZOOM } from '../../../constants';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { extractPageText, getPdfPageCount } from '../utils/pdfMeta';
import { diffTokens, summarizeDiff } from '../utils/textDiff';

export const VIEW_MODES = {
  SIDE: 'side',
  OVERLAY: 'overlay',
  TEXT: 'text',
};

export function useComparePdf() {
  const [leftFile, setLeftFile] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [leftUrl, setLeftUrl] = useState(null);
  const [rightUrl, setRightUrl] = useState(null);
  const [leftPages, setLeftPages] = useState(0);
  const [rightPages, setRightPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(ZOOM.DEFAULT);
  const [viewMode, setViewMode] = useState(VIEW_MODES.SIDE);
  const [overlayOpacity, setOverlayOpacity] = useState(0.45);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [isDiffing, setIsDiffing] = useState(false);

  useEffect(() => {
    if (!leftFile) {
      setLeftUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(leftFile);
    setLeftUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [leftFile]);

  useEffect(() => {
    if (!rightFile) {
      setRightUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(rightFile);
    setRightUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [rightFile]);

  useEffect(() => {
    if (!leftFile && !rightFile) {
      setLeftPages(0);
      setRightPages(0);
      setLoadError(null);
      setCurrentPage(1);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    (async () => {
      try {
        const [lCount, rCount] = await Promise.all([
          leftFile ? getPdfPageCount(leftFile) : Promise.resolve(0),
          rightFile ? getPdfPageCount(rightFile) : Promise.resolve(0),
        ]);

        if (cancelled) return;

        if (leftFile && (lCount == null || lCount < 1)) {
          setLoadError('Could not read the original PDF.');
          toast.error('Could not read the original PDF.');
          setIsLoading(false);
          return;
        }
        if (rightFile && (rCount == null || rCount < 1)) {
          setLoadError('Could not read the revised PDF.');
          toast.error('Could not read the revised PDF.');
          setIsLoading(false);
          return;
        }

        setLeftPages(lCount || 0);
        setRightPages(rCount || 0);
        setCurrentPage(1);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setLoadError('Failed to load one of the PDFs.');
          setIsLoading(false);
          toast.error('Failed to load PDFs.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [leftFile, rightFile]);

  const maxPages = Math.max(leftPages, rightPages, 1);

  useEffect(() => {
    if (!leftFile || !rightFile || currentPage < 1) {
      setLeftText('');
      setRightText('');
      return undefined;
    }

    let cancelled = false;
    setIsDiffing(true);

    (async () => {
      const [lText, rText] = await Promise.all([
        currentPage <= leftPages ? extractPageText(leftFile, currentPage) : Promise.resolve(''),
        currentPage <= rightPages ? extractPageText(rightFile, currentPage) : Promise.resolve(''),
      ]);
      if (cancelled) return;
      setLeftText(lText);
      setRightText(rText);
      setIsDiffing(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [leftFile, rightFile, currentPage, leftPages, rightPages]);

  const diffParts = useMemo(() => diffTokens(leftText, rightText), [leftText, rightText]);
  const diffSummary = useMemo(() => summarizeDiff(diffParts), [diffParts]);

  const acceptLeft = useCallback((file) => {
    if (!validatePdfFile(file)) return;
    setLeftFile(file);
  }, []);

  const acceptRight = useCallback((file) => {
    if (!validatePdfFile(file)) return;
    setRightFile(file);
  }, []);

  const loadLeft = useCallback(
    (event) => {
      const file = event?.target?.files?.[0];
      acceptLeft(file);
      if (event?.target) event.target.value = '';
    },
    [acceptLeft]
  );

  const loadRight = useCallback(
    (event) => {
      const file = event?.target?.files?.[0];
      acceptRight(file);
      if (event?.target) event.target.value = '';
    },
    [acceptRight]
  );

  const clearAll = useCallback(() => {
    setLeftFile(null);
    setRightFile(null);
    setLeftPages(0);
    setRightPages(0);
    setCurrentPage(1);
    setScale(ZOOM.DEFAULT);
    setViewMode(VIEW_MODES.SIDE);
    setLoadError(null);
    setLeftText('');
    setRightText('');
  }, []);

  const swapFiles = useCallback(() => {
    setLeftFile(rightFile);
    setRightFile(leftFile);
  }, [leftFile, rightFile]);

  const ready = Boolean(leftFile && rightFile && leftPages > 0 && rightPages > 0 && !loadError);

  return {
    leftFile,
    rightFile,
    leftUrl,
    rightUrl,
    leftPages,
    rightPages,
    maxPages,
    currentPage,
    setCurrentPage,
    scale,
    setScale,
    viewMode,
    setViewMode,
    overlayOpacity,
    setOverlayOpacity,
    isLoading,
    loadError,
    leftText,
    rightText,
    diffParts,
    diffSummary,
    isDiffing,
    loadLeft,
    loadRight,
    acceptLeft,
    acceptRight,
    clearAll,
    swapFiles,
    ready,
  };
}
