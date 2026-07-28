import { useCallback, useRef, useState } from 'react';
import { MAX_PDF_BYTES } from '../../../constants';
import { formatFileSize } from '../utils/textDiff';

function DropSlot({ label, hint, file, onFileChange, onFileDrop, inputId, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const maxMb = Math.round(MAX_PDF_BYTES / (1024 * 1024));

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) onFileDrop?.(dropped);
    },
    [disabled, onFileDrop]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'rounded-2xl border-2 border-dashed bg-white px-5 py-8 text-center transition-all',
        isDragging
          ? 'border-indigo-500 bg-indigo-50/70 scale-[1.01]'
          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/40',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="application/pdf,.pdf"
        onChange={onFileChange}
        className="sr-only"
      />

      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <rect x="5" y="3" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <rect x="9" y="7" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <h3 className="mb-1 text-base font-bold text-slate-900">{label}</h3>
      <p className="mb-4 text-xs text-slate-500">{hint}</p>

      {file ? (
        <div className="mx-auto max-w-xs rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-left">
          <p className="truncate text-sm font-semibold text-slate-800" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
      >
        {file ? 'Replace PDF' : 'Choose PDF'}
      </button>
      <p className="mt-2 text-[11px] text-slate-400">Max {maxMb} MB · Local only</p>
    </div>
  );
}

export default function CompareUpload({
  leftFile,
  rightFile,
  onLeftChange,
  onRightChange,
  onLeftDrop,
  onRightDrop,
  onCompare,
  canCompare,
  disabled,
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DropSlot
          label="Original PDF"
          hint="Older version / before changes"
          file={leftFile}
          onFileChange={onLeftChange}
          onFileDrop={onLeftDrop}
          inputId="compare-left-upload"
          disabled={disabled}
        />
        <DropSlot
          label="Revised PDF"
          hint="Newer version / after changes"
          file={rightFile}
          onFileChange={onRightChange}
          onFileDrop={onRightDrop}
          inputId="compare-right-upload"
          disabled={disabled}
        />
      </div>

      <button
        type="button"
        onClick={onCompare}
        disabled={!canCompare || disabled}
        className="w-full rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-40"
      >
        Compare documents
      </button>
    </div>
  );
}
