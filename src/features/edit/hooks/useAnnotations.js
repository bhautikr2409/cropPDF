import { useCallback, useMemo, useState } from 'react';
import { createId, DEFAULT_STYLE, EDIT_TOOLS } from '../utils/editConstants';

function applyDragOffset(ann, dx, dy) {
  if (ann.type === 'line') {
    return {
      ...ann,
      x1: ann.x1 + dx,
      y1: ann.y1 + dy,
      x2: ann.x2 + dx,
      y2: ann.y2 + dy,
    };
  }
  if (ann.type === 'pen') {
    return {
      ...ann,
      points: ann.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
    };
  }
  return {
    ...ann,
    x: ann.x + dx,
    y: ann.y + dy,
  };
}

/**
 * Annotation store + drawing interactions for the edit canvas.
 * Coordinates are page-relative CSS pixels (top-left origin).
 */
export function useAnnotations() {
  const [annotationsByPage, setAnnotationsByPage] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState(EDIT_TOOLS.TEXT);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [draft, setDraft] = useState(null);
  const [drag, setDrag] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);

  const updateStyle = useCallback((patch) => {
    setStyle((prev) => ({ ...prev, ...patch }));
  }, []);

  const getPageAnnotations = useCallback(
    (pageNumber) => annotationsByPage[pageNumber] || [],
    [annotationsByPage]
  );

  const selectedAnnotation = useMemo(() => {
    for (const list of Object.values(annotationsByPage)) {
      const found = list.find((a) => a.id === selectedId);
      if (found) return found;
    }
    return null;
  }, [annotationsByPage, selectedId]);

  const addAnnotation = useCallback((pageNumber, annotation) => {
    setAnnotationsByPage((prev) => ({
      ...prev,
      [pageNumber]: [...(prev[pageNumber] || []), annotation],
    }));
    setSelectedId(annotation.id);
  }, []);

  const updateAnnotation = useCallback((id, patch) => {
    setAnnotationsByPage((prev) => {
      const next = { ...prev };
      for (const page of Object.keys(next)) {
        next[page] = next[page].map((ann) => (ann.id === id ? { ...ann, ...patch } : ann));
      }
      return next;
    });
  }, []);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setAnnotationsByPage((prev) => {
      const next = {};
      for (const [page, list] of Object.entries(prev)) {
        next[page] = list.filter((ann) => ann.id !== selectedId);
      }
      return next;
    });
    setSelectedId(null);
    setEditingTextId(null);
  }, [selectedId]);

  const clearPage = useCallback((pageNumber) => {
    setAnnotationsByPage((prev) => ({ ...prev, [pageNumber]: [] }));
    setSelectedId(null);
    setEditingTextId(null);
  }, []);

  const clearAll = useCallback(() => {
    setAnnotationsByPage({});
    setSelectedId(null);
    setDraft(null);
    setDrag(null);
    setEditingTextId(null);
  }, []);

  const getPoint = (event, pageEl) => {
    const rect = pageEl.getBoundingClientRect();
    const point = event.touches?.[0] || event;
    return {
      x: Math.max(0, Math.min(rect.width, point.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, point.clientY - rect.top)),
    };
  };

  /** Click/drag an existing annotation — never creates a new one. */
  const onAnnotationPointerDown = useCallback((event, annotation, pageEl) => {
    event.stopPropagation();
    event.preventDefault();
    if (!pageEl) return;

    setTool(EDIT_TOOLS.SELECT);
    setSelectedId(annotation.id);
    if (annotation.type !== 'text') setEditingTextId(null);

    const p = getPoint(event, pageEl);
    setDrag({
      id: annotation.id,
      startX: p.x,
      startY: p.y,
      origin: { ...annotation, points: annotation.points ? annotation.points.map((pt) => ({ ...pt })) : undefined },
    });
  }, []);

  const onTextDoubleClick = useCallback((event, annotation) => {
    event.stopPropagation();
    event.preventDefault();
    setTool(EDIT_TOOLS.SELECT);
    setSelectedId(annotation.id);
    setEditingTextId(annotation.id);
    setDrag(null);
  }, []);

  const onPointerDown = useCallback(
    (event, pageNumber, pageEl) => {
      if (!pageEl) return;
      const p = getPoint(event, pageEl);

      setEditingTextId(null);

      if (tool === EDIT_TOOLS.SELECT) {
        setSelectedId(null);
        return;
      }

      event.preventDefault();

      if (tool === EDIT_TOOLS.TEXT) {
        const ann = {
          id: createId(),
          type: 'text',
          page: pageNumber,
          x: p.x,
          y: p.y,
          text: '',
          color: style.color,
          fontSize: style.fontSize,
          fontFamily: style.fontFamily,
        };
        addAnnotation(pageNumber, ann);
        setTool(EDIT_TOOLS.SELECT);
        setEditingTextId(ann.id);
        return;
      }

      if (tool === EDIT_TOOLS.IMAGE) {
        return;
      }

      if (tool === EDIT_TOOLS.PEN) {
        setDraft({
          id: createId(),
          type: 'pen',
          page: pageNumber,
          points: [p],
          color: style.color,
          strokeWidth: style.strokeWidth,
        });
        return;
      }

      if (tool === EDIT_TOOLS.LINE) {
        setDraft({
          id: createId(),
          type: 'line',
          page: pageNumber,
          x1: p.x,
          y1: p.y,
          x2: p.x,
          y2: p.y,
          color: style.color,
          strokeWidth: style.strokeWidth,
        });
        return;
      }

      if (tool === EDIT_TOOLS.RECT || tool === EDIT_TOOLS.ELLIPSE) {
        setDraft({
          id: createId(),
          type: tool === EDIT_TOOLS.RECT ? 'rect' : 'ellipse',
          page: pageNumber,
          x: p.x,
          y: p.y,
          width: 0,
          height: 0,
          originX: p.x,
          originY: p.y,
          color: style.color,
          strokeWidth: style.strokeWidth,
          filled: false,
        });
      }
    },
    [addAnnotation, style, tool]
  );

  const onPointerMove = useCallback(
    (event, pageEl) => {
      if (!pageEl) return;
      const p = getPoint(event, pageEl);

      if (drag) {
        const dx = p.x - drag.startX;
        const dy = p.y - drag.startY;
        const moved = applyDragOffset(drag.origin, dx, dy);
        updateAnnotation(drag.id, moved);
        return;
      }

      if (!draft) return;

      if (draft.type === 'pen') {
        setDraft((prev) => ({ ...prev, points: [...prev.points, p] }));
        return;
      }

      if (draft.type === 'line') {
        setDraft((prev) => ({ ...prev, x2: p.x, y2: p.y }));
        return;
      }

      if (draft.type === 'rect' || draft.type === 'ellipse') {
        const x = Math.min(draft.originX, p.x);
        const y = Math.min(draft.originY, p.y);
        const width = Math.abs(p.x - draft.originX);
        const height = Math.abs(p.y - draft.originY);
        setDraft((prev) => ({ ...prev, x, y, width, height }));
      }
    },
    [draft, drag, updateAnnotation]
  );

  const onPointerUp = useCallback(() => {
    if (drag) {
      setDrag(null);
      return;
    }

    if (!draft) return;

    if (draft.type === 'pen' && draft.points.length > 1) {
      const { originX, originY, ...ann } = draft;
      void originX;
      void originY;
      addAnnotation(draft.page, ann);
      setTool(EDIT_TOOLS.SELECT);
    } else if (draft.type === 'line') {
      if (Math.hypot(draft.x2 - draft.x1, draft.y2 - draft.y1) > 3) {
        addAnnotation(draft.page, draft);
        setTool(EDIT_TOOLS.SELECT);
      }
    } else if (draft.type === 'rect' || draft.type === 'ellipse') {
      if (draft.width > 3 && draft.height > 3) {
        const { originX, originY, ...ann } = draft;
        void originX;
        void originY;
        addAnnotation(draft.page, ann);
        setTool(EDIT_TOOLS.SELECT);
      }
    }

    setDraft(null);
  }, [addAnnotation, draft, drag]);

  const addImageAnnotation = useCallback(
    (pageNumber, dataUrl, x = 40, y = 40) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 220;
        const scale = Math.min(1, maxW / img.width);
        addAnnotation(pageNumber, {
          id: createId(),
          type: 'image',
          page: pageNumber,
          x,
          y,
          width: Math.max(40, img.width * scale),
          height: Math.max(40, img.height * scale),
          dataUrl,
        });
        setTool(EDIT_TOOLS.SELECT);
      };
      img.src = dataUrl;
    },
    [addAnnotation]
  );

  const totalCount = useMemo(
    () => Object.values(annotationsByPage).reduce((sum, list) => sum + list.length, 0),
    [annotationsByPage]
  );

  /** Keep annotation pixels aligned when the rendered page size changes (zoom). */
  const rescaleAll = useCallback((fromSize, toSize) => {
    if (!fromSize?.width || !toSize?.width || fromSize.width === toSize.width) return;
    const sx = toSize.width / fromSize.width;
    const sy = toSize.height / fromSize.height;
    if (!Number.isFinite(sx) || !Number.isFinite(sy) || (sx === 1 && sy === 1)) return;

    const scaleAnn = (ann) => {
      if (ann.type === 'line') {
        return {
          ...ann,
          x1: ann.x1 * sx,
          y1: ann.y1 * sy,
          x2: ann.x2 * sx,
          y2: ann.y2 * sy,
          strokeWidth: (ann.strokeWidth || 2) * sx,
        };
      }
      if (ann.type === 'pen') {
        return {
          ...ann,
          points: ann.points.map((p) => ({ x: p.x * sx, y: p.y * sy })),
          strokeWidth: (ann.strokeWidth || 2) * sx,
        };
      }
      if (ann.type === 'text') {
        return {
          ...ann,
          x: ann.x * sx,
          y: ann.y * sy,
          fontSize: Math.max(8, (ann.fontSize || 16) * sx),
        };
      }
      return {
        ...ann,
        x: ann.x * sx,
        y: ann.y * sy,
        width: (ann.width || 0) * sx,
        height: (ann.height || 0) * sy,
        strokeWidth: ann.strokeWidth ? ann.strokeWidth * sx : ann.strokeWidth,
      };
    };

    setAnnotationsByPage((prev) => {
      const next = {};
      for (const [page, list] of Object.entries(prev)) {
        next[page] = list.map(scaleAnn);
      }
      return next;
    });
    setDraft((prev) => (prev ? scaleAnn(prev) : null));
    setDrag(null);
  }, []);

  return {
    annotationsByPage,
    selectedId,
    setSelectedId,
    selectedAnnotation,
    tool,
    setTool,
    style,
    updateStyle,
    draft,
    editingTextId,
    setEditingTextId,
    getPageAnnotations,
    updateAnnotation,
    deleteSelected,
    clearPage,
    clearAll,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onAnnotationPointerDown,
    onTextDoubleClick,
    addImageAnnotation,
    rescaleAll,
    totalCount,
  };
}
