import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { compressionPercent } from '../utils/compressLevels';
import { compressAndDownload, getPdfMeta } from '../utils/compressPdf';

/**
 * Manages compress PDF file lifecycle, level selection, progress, and download.
 */
export function useCompressPdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [level, setLevel] = useState('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    if (!file) {
      setPageCount(0);
      setLoadError(null);
      setLastResult(null);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    setLastResult(null);

    getPdfMeta(file).then((meta) => {
      if (cancelled) return;
      setIsLoading(false);
      if (!meta?.pageCount) {
        setLoadError('Could not read this PDF. It may be damaged or password-protected.');
        setPageCount(0);
        toast.error('Could not read this PDF.');
        return;
      }
      setPageCount(meta.pageCount);
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
    setLevel('recommended');
  }, []);

  const acceptFile = useCallback((selected) => {
    if (!validatePdfFile(selected)) return;
    setFile(selected);
    setLevel('recommended');
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setPageCount(0);
    setLoadError(null);
    setLevel('recommended');
    setProgress({ current: 0, total: 0 });
    setLastResult(null);
  }, []);

  const runCompress = useCallback(async () => {
    if (!file || pageCount < 1) {
      toast.error('Upload a PDF first.');
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: pageCount });
    setLastResult(null);

    try {
      const result = await compressAndDownload(file, level, {
        onProgress: (current, total) => setProgress({ current, total }),
      });

      if (result) {
        const originalSize = file.size;
        const compressedSize = result.blob.size;
        const saved = compressionPercent(originalSize, compressedSize);

        setLastResult({
          originalSize,
          compressedSize,
          savedPercent: saved,
          pageCount: result.pageCount,
        });

        if (compressedSize >= originalSize) {
          toast.success(
            'Compressed PDF downloaded. Size did not shrink much (common for already-optimized files).'
          );
        } else {
          toast.success(
            `Compressed successfully${saved != null ? ` (${saved}% smaller)` : ''}.`
          );
        }
      }
    } finally {
      setIsProcessing(false);
    }
  }, [file, level, pageCount]);

  return {
    file,
    pageCount,
    isLoading,
    loadError,
    level,
    setLevel,
    isProcessing,
    progress,
    lastResult,
    loadFile,
    acceptFile,
    clearFile,
    runCompress,
  };
}
