import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { imagesToPdfAndDownload } from '../utils/imagesToPdf';
import { validateImageFiles } from '../utils/validateImages';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useImageToPdf() {
  const [files, setFiles] = useState([]);
  const [pageSize, setPageSize] = useState('fit');
  const [isProcessing, setIsProcessing] = useState(false);
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => {
    return () => {
      filesRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const addFiles = useCallback(async (incoming) => {
    const accepted = validateImageFiles(incoming, filesRef.current);
    if (accepted.length === 0) return;

    const newItems = accepted.map((file) => ({
      id: createId(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newItems]);
    toast.success(
      accepted.length === 1
        ? `Added "${accepted[0].name}"`
        : `Added ${accepted.length} images`
    );
  }, []);

  const removeFile = useCallback((id) => {
    setFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      return [];
    });
  }, []);

  const moveFile = useCallback((id, direction) => {
    setFiles((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index < 0) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }, []);

  const reorderFiles = useCallback((fromId, toId) => {
    if (fromId === toId) return;
    setFiles((prev) => {
      const fromIndex = prev.findIndex((item) => item.id === fromId);
      const toIndex = prev.findIndex((item) => item.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  }, []);

  const convert = useCallback(async () => {
    if (filesRef.current.length < 1) {
      toast.error('Add at least one image.');
      return;
    }
    setIsProcessing(true);
    try {
      await imagesToPdfAndDownload(filesRef.current, { pageSize });
    } finally {
      setIsProcessing(false);
    }
  }, [pageSize]);

  const totalBytes = files.reduce((sum, item) => sum + item.file.size, 0);

  return {
    files,
    pageSize,
    setPageSize,
    isProcessing,
    totalBytes,
    addFiles,
    removeFile,
    clearFiles,
    moveFile,
    reorderFiles,
    convert,
  };
}
