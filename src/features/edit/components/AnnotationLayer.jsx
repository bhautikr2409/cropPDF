import { useEffect, useRef, useState } from 'react';
import { EDIT_TOOLS } from '../utils/editConstants';

function fontFamilyCss(fontFamily) {
  if (fontFamily === 'TimesRoman') return 'Times New Roman, serif';
  if (fontFamily === 'Courier') return 'Courier New, monospace';
  return 'Helvetica, Arial, sans-serif';
}

function AnnotationItem({
  ann,
  selected,
  isEditing,
  onAnnotationPointerDown,
  onTextDoubleClick,
  onUpdate,
  onFinishEdit,
}) {
  const selectedClass = selected ? 'outline outline-1 outline-slate-400 outline-offset-2' : '';
  const inputRef = useRef(null);
  const [draftText, setDraftText] = useState(ann.text || '');

  useEffect(() => {
    if (!isEditing) return undefined;
    setDraftText(ann.text || '');
    const id = requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.select();
    });
    return () => cancelAnimationFrame(id);
    // Only re-init when entering edit mode for this annotation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, ann.id]);

  const commitText = (value) => {
    const next = String(value ?? '').trim();
    onUpdate(ann.id, { text: next || 'Text' });
    onFinishEdit();
  };

  if (ann.type === 'text') {
    return (
      <div
        role="button"
        tabIndex={0}
        onMouseDown={(e) => {
          if (isEditing) {
            e.stopPropagation();
            return;
          }
          onAnnotationPointerDown(e, ann);
        }}
        onTouchStart={(e) => {
          if (isEditing) {
            e.stopPropagation();
            return;
          }
          onAnnotationPointerDown(e, ann);
        }}
        onDoubleClick={(e) => onTextDoubleClick(e, ann)}
        className={`absolute ${selectedClass} ${isEditing ? 'cursor-text' : 'cursor-move select-none'}`}
        style={{
          left: ann.x,
          top: ann.y,
          color: ann.color,
          fontSize: ann.fontSize,
          fontFamily: fontFamilyCss(ann.fontFamily),
          lineHeight: 1.2,
          maxWidth: 320,
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={draftText}
            placeholder="Type here…"
            onChange={(e) => {
              const value = e.target.value;
              setDraftText(value);
              // Keep React state in sync so click-outside never loses the typed text
              onUpdate(ann.id, { text: value });
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onBlur={(e) => commitText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitText(e.currentTarget.value);
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                commitText(e.currentTarget.value);
              }
              e.stopPropagation();
            }}
            className="bg-transparent border-0 p-0 m-0 outline-none shadow-none placeholder:text-slate-400"
            style={{
              color: ann.color,
              fontSize: ann.fontSize,
              fontFamily: fontFamilyCss(ann.fontFamily),
              lineHeight: 1.2,
              width: Math.max(120, Math.max(draftText.length, 8) * (ann.fontSize * 0.55)),
              maxWidth: 320,
            }}
          />
        ) : (
          <span style={{ whiteSpace: 'pre-wrap' }}>{ann.text || 'Text'}</span>
        )}
      </div>
    );
  }

  if (ann.type === 'image') {
    return (
      <img
        src={ann.dataUrl}
        alt=""
        draggable={false}
        onMouseDown={(e) => onAnnotationPointerDown(e, ann)}
        onTouchStart={(e) => onAnnotationPointerDown(e, ann)}
        className={`absolute cursor-move object-contain ${selectedClass}`}
        style={{ left: ann.x, top: ann.y, width: ann.width, height: ann.height }}
      />
    );
  }

  if (ann.type === 'rect') {
    return (
      <div
        onMouseDown={(e) => onAnnotationPointerDown(e, ann)}
        onTouchStart={(e) => onAnnotationPointerDown(e, ann)}
        className={`absolute cursor-move ${selectedClass}`}
        style={{
          left: ann.x,
          top: ann.y,
          width: ann.width,
          height: ann.height,
          border: `${ann.strokeWidth || 2}px solid ${ann.color}`,
          background: ann.filled ? `${ann.color}33` : 'transparent',
        }}
      />
    );
  }

  if (ann.type === 'ellipse') {
    return (
      <div
        onMouseDown={(e) => onAnnotationPointerDown(e, ann)}
        onTouchStart={(e) => onAnnotationPointerDown(e, ann)}
        className={`absolute cursor-move ${selectedClass}`}
        style={{
          left: ann.x,
          top: ann.y,
          width: ann.width,
          height: ann.height,
          border: `${ann.strokeWidth || 2}px solid ${ann.color}`,
          borderRadius: '50%',
          background: ann.filled ? `${ann.color}33` : 'transparent',
        }}
      />
    );
  }

  if (ann.type === 'line') {
    const minX = Math.min(ann.x1, ann.x2);
    const minY = Math.min(ann.y1, ann.y2);
    const width = Math.max(1, Math.abs(ann.x2 - ann.x1));
    const height = Math.max(1, Math.abs(ann.y2 - ann.y1));
    return (
      <svg
        className={`absolute overflow-visible cursor-move ${selectedClass}`}
        style={{ left: minX, top: minY, width, height }}
        onMouseDown={(e) => onAnnotationPointerDown(e, ann)}
        onTouchStart={(e) => onAnnotationPointerDown(e, ann)}
      >
        <line
          x1={ann.x1 - minX}
          y1={ann.y1 - minY}
          x2={ann.x2 - minX}
          y2={ann.y2 - minY}
          stroke={ann.color}
          strokeWidth={Math.max(8, ann.strokeWidth || 2)}
          strokeLinecap="round"
          strokeOpacity={0}
        />
        <line
          x1={ann.x1 - minX}
          y1={ann.y1 - minY}
          x2={ann.x2 - minX}
          y2={ann.y2 - minY}
          stroke={ann.color}
          strokeWidth={ann.strokeWidth || 2}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (ann.type === 'pen' && ann.points?.length) {
    const xs = ann.points.map((p) => p.x);
    const ys = ann.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    const d = ann.points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x - minX} ${p.y - minY}`)
      .join(' ');
    return (
      <svg
        className={`absolute overflow-visible cursor-move ${selectedClass}`}
        style={{
          left: minX,
          top: minY,
          width: Math.max(1, maxX - minX),
          height: Math.max(1, maxY - minY),
        }}
        onMouseDown={(e) => onAnnotationPointerDown(e, ann)}
        onTouchStart={(e) => onAnnotationPointerDown(e, ann)}
      >
        <path
          d={d}
          fill="none"
          stroke={ann.color}
          strokeWidth={Math.max(10, ann.strokeWidth || 2)}
          strokeOpacity={0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={d}
          fill="none"
          stroke={ann.color}
          strokeWidth={ann.strokeWidth || 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return null;
}

function DraftPreview({ draft }) {
  if (!draft) return null;
  if (draft.type === 'rect') {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: draft.x,
          top: draft.y,
          width: draft.width,
          height: draft.height,
          border: `${draft.strokeWidth || 2}px solid ${draft.color}`,
        }}
      />
    );
  }
  if (draft.type === 'ellipse') {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: draft.x,
          top: draft.y,
          width: draft.width,
          height: draft.height,
          border: `${draft.strokeWidth || 2}px solid ${draft.color}`,
          borderRadius: '50%',
        }}
      />
    );
  }
  if (draft.type === 'line') {
    const minX = Math.min(draft.x1, draft.x2);
    const minY = Math.min(draft.y1, draft.y2);
    return (
      <svg
        className="absolute pointer-events-none overflow-visible"
        style={{
          left: minX,
          top: minY,
          width: Math.max(1, Math.abs(draft.x2 - draft.x1)),
          height: Math.max(1, Math.abs(draft.y2 - draft.y1)),
        }}
      >
        <line
          x1={draft.x1 - minX}
          y1={draft.y1 - minY}
          x2={draft.x2 - minX}
          y2={draft.y2 - minY}
          stroke={draft.color}
          strokeWidth={draft.strokeWidth || 2}
        />
      </svg>
    );
  }
  if (draft.type === 'pen' && draft.points?.length) {
    const xs = draft.points.map((p) => p.x);
    const ys = draft.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const d = draft.points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x - minX} ${p.y - minY}`)
      .join(' ');
    return (
      <svg
        className="absolute pointer-events-none overflow-visible"
        style={{
          left: minX,
          top: minY,
          width: Math.max(1, Math.max(...xs) - minX),
          height: Math.max(1, Math.max(...ys) - minY),
        }}
      >
        <path
          d={d}
          fill="none"
          stroke={draft.color}
          strokeWidth={draft.strokeWidth || 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return null;
}

export default function AnnotationLayer({
  annotations,
  draft,
  selectedId,
  editingTextId,
  tool,
  pageElRef,
  onSelect,
  onUpdate,
  onFinishEdit,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onAnnotationPointerDown,
  onTextDoubleClick,
}) {
  void onSelect;

  const cursor =
    tool === EDIT_TOOLS.SELECT
      ? 'default'
      : tool === EDIT_TOOLS.TEXT
        ? 'text'
        : 'crosshair';

  const handleAnnDown = (event, ann) => {
    onAnnotationPointerDown(event, ann, pageElRef?.current);
  };

  return (
    <div
      className="absolute inset-0 z-10"
      style={{ cursor }}
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      {annotations.map((ann) => (
        <AnnotationItem
          key={ann.id}
          ann={ann}
          selected={selectedId === ann.id}
          isEditing={editingTextId === ann.id}
          onAnnotationPointerDown={handleAnnDown}
          onTextDoubleClick={onTextDoubleClick}
          onUpdate={onUpdate}
          onFinishEdit={onFinishEdit}
        />
      ))}
      <DraftPreview draft={draft} />
    </div>
  );
}
