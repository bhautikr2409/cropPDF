import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { getPdfPageCount, mergeAndDownloadPdfs } from '../utils/mergePdfs';
import { validateMergeFiles } from '../utils/validateMergeFiles';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Manages the merge queue: add, remove, reorder, and download.
 */
export function useMergePdf() {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const filesRef = useRef(files);
  filesRef.current = files;

  const addFiles = useCallback(async (incoming) => {
    const accepted = validateMergeFiles(incoming, filesRef.current);
    if (accepted.length === 0) return;

    const newItems = accepted.map((file) => ({
      id: createId(),
      file,
      pageCount: null,
      status: 'loading',
    }));

    setFiles((prev) => [...prev, ...newItems]);

    await Promise.all(
      newItems.map(async (item) => {
        const pageCount = await getPdfPageCount(item.file);
        setFiles((prev) =>
          prev.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  pageCount,
                  status: pageCount == null ? 'error' : 'ready',
                }
              : entry
          )
        );
      })
    );

    toast.success(
      accepted.length === 1
        ? `Added "${accepted[0].name}"`
        : `Added ${accepted.length} PDFs`
    );
  }, []);

  const removeFile = useCallback((id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
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

  const mergeFiles = useCallback(async () => {
    const ready = filesRef.current.filter((item) => item.status !== 'error');
    if (ready.length < 2) {
      toast.error('Add at least two valid PDFs to merge.');
      return;
    }

    setIsMerging(true);
    try {
      await mergeAndDownloadPdfs(ready);
    } finally {
      setIsMerging(false);
    }
  }, []);

  const totalPages = files.reduce(
    (sum, item) => sum + (typeof item.pageCount === 'number' ? item.pageCount : 0),
    0
  );

  const totalBytes = files.reduce((sum, item) => sum + item.file.size, 0);

  return {
    files,
    isMerging,
    totalPages,
    totalBytes,
    addFiles,
    removeFile,
    clearFiles,
    moveFile,
    reorderFiles,
    mergeFiles,
  };
}
