import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import {
  createPageId,
  getPdfPageCount,
  organizeAndDownload,
} from '../utils/organizePdf';

function buildOriginalPages(pageCount) {
  return Array.from({ length: pageCount }, (_, i) => ({
    id: createPageId(),
    kind: 'original',
    pageNumber: i + 1,
  }));
}

export function useOrganizePdf() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState([]);
  const [insertFiles, setInsertFiles] = useState({});
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInserting, setIsInserting] = useState(false);

  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const insertFilesRef = useRef(insertFiles);
  insertFilesRef.current = insertFiles;

  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const revokeInsertUrls = useCallback((map) => {
    Object.values(map || {}).forEach((item) => {
      if (item?.url) URL.revokeObjectURL(item.url);
    });
  }, []);

  useEffect(() => {
    return () => {
      revokeInsertUrls(insertFilesRef.current);
    };
  }, [revokeInsertUrls]);

  const acceptFile = useCallback(async (incoming) => {
    if (!validatePdfFile(incoming)) return;

    setIsLoading(true);
    setLoadError(null);
    setSelectedIds(new Set());
    revokeInsertUrls(insertFilesRef.current);
    setInsertFiles({});
    setPages([]);

    const count = await getPdfPageCount(incoming);
    if (count == null || count < 1) {
      setFile(null);
      setPageCount(0);
      setLoadError('Could not read this PDF.');
      setIsLoading(false);
      toast.error('Could not read this PDF.');
      return;
    }

    setFile(incoming);
    setPageCount(count);
    setPages(buildOriginalPages(count));
    setIsLoading(false);
    toast.success(`Loaded ${count} page${count === 1 ? '' : 's'}.`);
  }, [revokeInsertUrls]);

  const loadFile = useCallback(
    (event) => {
      const incoming = event?.target?.files?.[0];
      if (incoming) acceptFile(incoming);
      if (event?.target) event.target.value = '';
    },
    [acceptFile]
  );

  const clearFile = useCallback(() => {
    revokeInsertUrls(insertFilesRef.current);
    setFile(null);
    setPageCount(0);
    setPages([]);
    setInsertFiles({});
    setSelectedIds(new Set());
    setLoadError(null);
    setIsLoading(false);
    setIsProcessing(false);
  }, [revokeInsertUrls]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(pagesRef.current.map((p) => p.id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const removePages = useCallback((ids) => {
    const idSet = ids instanceof Set ? ids : new Set(ids);
    if (idSet.size === 0) return;

    setPages((prev) => {
      if (prev.length <= idSet.size) {
        toast.error('Keep at least one page in the document.');
        return prev;
      }
      const next = prev.filter((p) => !idSet.has(p.id));
      toast.success(
        idSet.size === 1 ? 'Removed 1 page.' : `Removed ${idSet.size} pages.`
      );
      return next;
    });
    setSelectedIds((prev) => {
      const next = new Set(prev);
      idSet.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const removeSelected = useCallback(() => {
    removePages(selectedIds);
  }, [removePages, selectedIds]);

  const removeOne = useCallback(
    (id) => {
      removePages(new Set([id]));
    },
    [removePages]
  );

  const movePage = useCallback((id, direction) => {
    setPages((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index < 0) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }, []);

  const reorderPages = useCallback((fromId, toId) => {
    if (fromId === toId) return;
    setPages((prev) => {
      const fromIndex = prev.findIndex((p) => p.id === fromId);
      const toIndex = prev.findIndex((p) => p.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  }, []);

  const resetOrder = useCallback(() => {
    if (!file || pageCount < 1) return;
    revokeInsertUrls(insertFilesRef.current);
    setPages(buildOriginalPages(pageCount));
    setInsertFiles({});
    setSelectedIds(new Set());
    toast.success('Reset to original page order.');
  }, [file, pageCount, revokeInsertUrls]);

  /**
   * Insert all pages from another PDF after the last selected page,
   * or at the end if nothing is selected.
   */
  const insertPdfPages = useCallback(async (incoming) => {
    if (!file) {
      toast.error('Load a PDF first.');
      return;
    }
    if (!validatePdfFile(incoming)) return;

    setIsInserting(true);
    try {
      const count = await getPdfPageCount(incoming);
      if (count == null || count < 1) {
        toast.error('Could not read the PDF to insert.');
        return;
      }

      const insertId = createPageId();
      const url = URL.createObjectURL(incoming);
      const newPages = Array.from({ length: count }, (_, i) => ({
        id: createPageId(),
        kind: 'inserted',
        insertId,
        pageNumber: i + 1,
        label: incoming.name,
      }));

      setInsertFiles((prev) => ({
        ...prev,
        [insertId]: { id: insertId, file: incoming, pageCount: count, url },
      }));

      setPages((prev) => {
        const selected = selectedIds;
        let insertAt = prev.length;
        if (selected.size > 0) {
          let lastSelected = -1;
          prev.forEach((p, i) => {
            if (selected.has(p.id)) lastSelected = i;
          });
          if (lastSelected >= 0) insertAt = lastSelected + 1;
        }
        const next = [...prev];
        next.splice(insertAt, 0, ...newPages);
        return next;
      });

      toast.success(
        count === 1
          ? `Added 1 page from "${incoming.name}".`
          : `Added ${count} pages from "${incoming.name}".`
      );
    } finally {
      setIsInserting(false);
    }
  }, [file, selectedIds]);

  const loadInsertFile = useCallback(
    (event) => {
      const incoming = event?.target?.files?.[0];
      if (incoming) insertPdfPages(incoming);
      if (event?.target) event.target.value = '';
    },
    [insertPdfPages]
  );

  const runOrganize = useCallback(async () => {
    if (!file || pagesRef.current.length < 1) {
      toast.error('Keep at least one page in the document.');
      return;
    }

    setIsProcessing(true);
    try {
      await organizeAndDownload(file, pagesRef.current, insertFilesRef.current);
    } finally {
      setIsProcessing(false);
    }
  }, [file]);

  const hasChanges = useMemo(() => {
    if (!file || pageCount < 1) return false;
    if (pages.length !== pageCount) return true;
    if (Object.keys(insertFiles).length > 0) return true;
    return pages.some(
      (p, i) => p.kind !== 'original' || p.pageNumber !== i + 1
    );
  }, [file, pageCount, pages, insertFiles]);

  const getPagePreviewUrl = useCallback(
    (page) => {
      if (page.kind === 'original') return fileUrl;
      return insertFiles[page.insertId]?.url || null;
    },
    [fileUrl, insertFiles]
  );

  return {
    file,
    fileUrl,
    pageCount,
    pages,
    insertFiles,
    selectedIds,
    isLoading,
    loadError,
    isProcessing,
    isInserting,
    hasChanges,
    loadFile,
    acceptFile,
    clearFile,
    toggleSelect,
    selectAll,
    clearSelection,
    removeSelected,
    removeOne,
    movePage,
    reorderPages,
    resetOrder,
    loadInsertFile,
    insertPdfPages,
    runOrganize,
    getPagePreviewUrl,
  };
}
