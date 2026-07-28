import { MIN_CROP_SIZE } from '../../../constants';

/**
 * Build a crop rectangle from two pointer points inside a container.
 */
export function rectFromPoints(start, current) {
  return {
    x: Math.min(start.x, current.x),
    y: Math.min(start.y, current.y),
    width: Math.abs(current.x - start.x),
    height: Math.abs(current.y - start.y),
  };
}

/**
 * Pointer position relative to a container element.
 */
export function getRelativePoint(clientX, clientY, container) {
  const rect = container.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

/**
 * Resize a crop area by drag delta for a given handle direction (n/s/e/w/…).
 */
export function applyResize(direction, startArea, deltaX, deltaY, containerRect) {
  const next = { ...startArea };
  const min = MIN_CROP_SIZE;

  if (direction.includes('e')) {
    next.width = Math.max(
      min,
      Math.min(startArea.width + deltaX, containerRect.width - startArea.x)
    );
  }
  if (direction.includes('s')) {
    next.height = Math.max(
      min,
      Math.min(startArea.height + deltaY, containerRect.height - startArea.y)
    );
  }
  if (direction.includes('w')) {
    const allowedDelta = Math.max(-startArea.x, Math.min(deltaX, startArea.width - min));
    next.x = startArea.x + allowedDelta;
    next.width = startArea.width - allowedDelta;
  }
  if (direction.includes('n')) {
    const allowedDelta = Math.max(-startArea.y, Math.min(deltaY, startArea.height - min));
    next.y = startArea.y + allowedDelta;
    next.height = startArea.height - allowedDelta;
  }

  return next;
}

/**
 * Convert a screen-space crop (relative to the page canvas) into PDF crop box
 * coordinates for a single page media box.
 */
export function screenCropToPdfBox(cropLocal, pageRect, mediaBox) {
  const originX = mediaBox.x || 0;
  const originY = mediaBox.y || 0;
  const pdfWidth = mediaBox.width;
  const pdfHeight = mediaBox.height;

  const scaleX = pdfWidth / pageRect.width;
  const scaleY = pdfHeight / pageRect.height;

  const localX = Math.max(0, cropLocal.x);
  const localY = Math.max(0, cropLocal.y);
  const localW = Math.min(pageRect.width - localX, cropLocal.width);
  const localH = Math.min(pageRect.height - localY, cropLocal.height);

  return {
    pdfX: originX + localX * scaleX,
    pdfY: originY + pdfHeight - (localY + localH) * scaleY,
    pdfW: localW * scaleX,
    pdfH: localH * scaleY,
  };
}

/**
 * Normalize crop area to ratios of the rendered page size (0–1),
 * so the same crop can be applied to every PDF page.
 */
export function cropToRatios(cropArea, pageLeft, pageTop, pageWidth, pageHeight) {
  const localX = cropArea.x - pageLeft;
  const localY = cropArea.y - pageTop;

  return {
    x: Math.max(0, localX) / pageWidth,
    y: Math.max(0, localY) / pageHeight,
    width: Math.min(pageWidth, cropArea.width) / pageWidth,
    height: Math.min(pageHeight, cropArea.height) / pageHeight,
  };
}
