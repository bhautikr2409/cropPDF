import { useCallback, useEffect, useState } from 'react';
import { applyResize, getRelativePoint, rectFromPoints } from '../utils/cropMath';

/**
 * Pointer-based crop rectangle selection and resize for a container ref.
 */
export function useCropSelection(containerRef) {
  const [cropArea, setCropArea] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setCropArea(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const clearCrop = useCallback(() => setCropArea(null), []);

  const onPointerDown = useCallback(
    (e) => {
      const container = containerRef.current;
      if (!container) return;

      const point = e.touches?.[0] ?? e;
      const { x, y } = getRelativePoint(point.clientX, point.clientY, container);

      setIsDragging(true);
      setStartPoint({ x, y });
      setCropArea({ x, y, width: 0, height: 0 });
    },
    [containerRef]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current) return;

      const point = e.touches?.[0] ?? e;
      const current = getRelativePoint(point.clientX, point.clientY, containerRef.current);
      setCropArea(rectFromPoints(startPoint, current));
    },
    [containerRef, isDragging, startPoint]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const beginResize = useCallback(
    (e, direction, isTouch = false) => {
      e.stopPropagation();
      if (!isTouch) e.preventDefault();
      if (!cropArea || !containerRef.current) return;

      const point = isTouch ? e.touches[0] : e;
      const startX = point.clientX;
      const startY = point.clientY;
      const startArea = { ...cropArea };
      const containerRect = containerRef.current.getBoundingClientRect();

      const onMove = (moveEvent) => {
        const movePoint = isTouch ? moveEvent.touches[0] : moveEvent;
        const deltaX = movePoint.clientX - startX;
        const deltaY = movePoint.clientY - startY;
        setCropArea(applyResize(direction, startArea, deltaX, deltaY, containerRect));
      };

      const onEnd = () => {
        const moveEvent = isTouch ? 'touchmove' : 'mousemove';
        const endEvent = isTouch ? 'touchend' : 'mouseup';
        document.removeEventListener(moveEvent, onMove);
        document.removeEventListener(endEvent, onEnd);
      };

      if (isTouch) {
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
      } else {
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
      }
    },
    [containerRef, cropArea]
  );

  return {
    cropArea,
    setCropArea,
    clearCrop,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    beginResize,
  };
}
