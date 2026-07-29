import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  MAX_MARKDOWN_BYTES,
  SAMPLE_MARKDOWN,
  formatFileSize,
  markdownToPdfAndDownload,
  markdownToPreviewHtml,
  validateMarkdownFile,
} from '../utils/markdownToPdf';
import { DEFAULT_TYPEFACE_ID, getTypeface } from '../utils/typefaces';

export const INPUT_MODES = {
  PASTE: 'paste',
  UPLOAD: 'upload',
};

export function useMarkdownToPdf() {
  const [mode, setMode] = useState(INPUT_MODES.PASTE);
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [fileName, setFileName] = useState('document.md');
  const [fileMeta, setFileMeta] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewTab, setPreviewTab] = useState('preview');
  const [typefaceId, setTypefaceId] = useState(DEFAULT_TYPEFACE_ID);

  const deferredMarkdown = useDeferredValue(markdown);
  const previewHtml = useMemo(
    () => markdownToPreviewHtml(deferredMarkdown),
    [deferredMarkdown]
  );
  const typeface = useMemo(() => getTypeface(typefaceId), [typefaceId]);

  const charCount = markdown.length;
  const canDownload = markdown.trim().length > 0 && !isProcessing;

  const acceptFile = useCallback(async (file) => {
    if (!validateMarkdownFile(file)) return;

    try {
      const text = await file.text();
      if (!text.trim()) {
        toast.error('This Markdown file is empty.');
        return;
      }
      if (new Blob([text]).size > MAX_MARKDOWN_BYTES) {
        toast.error('Markdown content must be under 2 MB.');
        return;
      }
      setMarkdown(text);
      setFileName(file.name);
      setFileMeta({ name: file.name, size: file.size });
      setMode(INPUT_MODES.UPLOAD);
      setPreviewTab('preview');
      toast.success(`Loaded "${file.name}"`);
    } catch (error) {
      console.error(error);
      toast.error('Could not read this file.');
    }
  }, []);

  const loadFile = useCallback(
    (event) => {
      const file = event?.target?.files?.[0];
      if (file) acceptFile(file);
      if (event?.target) event.target.value = '';
    },
    [acceptFile]
  );

  const clearAll = useCallback(() => {
    setMarkdown('');
    setFileName('document.md');
    setFileMeta(null);
    setPreviewTab('preview');
  }, []);

  const loadSample = useCallback(() => {
    setMarkdown(SAMPLE_MARKDOWN);
    setFileName('sample.md');
    setFileMeta(null);
    setMode(INPUT_MODES.PASTE);
    toast.success('Sample Markdown loaded.');
  }, []);

  const runDownload = useCallback(async () => {
    setIsProcessing(true);
    try {
      await markdownToPdfAndDownload(markdown, { filename: fileName, typefaceId });
    } finally {
      setIsProcessing(false);
    }
  }, [markdown, fileName, typefaceId]);

  return {
    mode,
    setMode,
    markdown,
    setMarkdown,
    fileName,
    fileMeta,
    isProcessing,
    previewTab,
    setPreviewTab,
    previewHtml,
    charCount,
    canDownload,
    typefaceId,
    setTypefaceId,
    typeface,
    loadFile,
    acceptFile,
    clearAll,
    loadSample,
    runDownload,
    formatFileSize,
  };
}
