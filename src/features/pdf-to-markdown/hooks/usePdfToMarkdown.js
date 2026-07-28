import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { parsePageSelection } from '../../split/utils/pageRanges';
import {
  convertPdfToMarkdown,
  copyMarkdown,
  downloadMarkdown,
  getPdfPageCount,
} from '../utils/pdfToMarkdown';

export const PAGE_SCOPE = {
  ALL: 'all',
  SELECTED: 'selected',
};

export function usePdfToMarkdown() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [scope, setScope] = useState(PAGE_SCOPE.ALL);
  const [rangeInput, setRangeInput] = useState('');
  const [pageBreakMode, setPageBreakMode] = useState('heading');
  const [includeTitle, setIncludeTitle] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    if (!file) {
      setPageCount(0);
      setLoadError(null);
      setMarkdown('');
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    setMarkdown('');

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
      setPageBreakMode('heading');
      setIncludeTitle(true);
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
    setMarkdown('');
  }, []);

  const resolvePages = useCallback(() => {
    if (scope === PAGE_SCOPE.ALL) {
      return { pages: Array.from({ length: pageCount }, (_, i) => i + 1) };
    }
    return parsePageSelection(rangeInput, pageCount);
  }, [pageCount, rangeInput, scope]);

  const runConvert = useCallback(async () => {
    if (!file || pageCount < 1) {
      toast.error('Upload a PDF first.');
      return;
    }

    const parsed = resolvePages();
    if (parsed.error) {
      toast.error(parsed.error);
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: parsed.pages.length });
    try {
      const md = await convertPdfToMarkdown(file, parsed.pages, {
        pageBreakMode,
        includeTitle,
        onProgress: (current, total) => setProgress({ current, total }),
      });
      if (md != null) {
        setMarkdown(md);
        toast.success('Conversion complete.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [file, includeTitle, pageBreakMode, pageCount, resolvePages]);

  const runDownload = useCallback(() => {
    if (!markdown) {
      toast.error('Convert the PDF first.');
      return;
    }
    downloadMarkdown(markdown, file?.name || 'document.pdf');
  }, [file, markdown]);

  const runCopy = useCallback(async () => {
    if (!markdown) {
      toast.error('Convert the PDF first.');
      return;
    }
    await copyMarkdown(markdown);
  }, [markdown]);

  return {
    file,
    pageCount,
    isLoading,
    loadError,
    scope,
    setScope,
    rangeInput,
    setRangeInput,
    pageBreakMode,
    setPageBreakMode,
    includeTitle,
    setIncludeTitle,
    isProcessing,
    progress,
    markdown,
    setMarkdown,
    loadFile,
    acceptFile,
    clearFile,
    runConvert,
    runDownload,
    runCopy,
  };
}
