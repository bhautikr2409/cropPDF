import { useCallback, useRef, useState } from 'react';
import { MAX_PDF_BYTES } from '../../../constants';

export default function CompressUpload({ onFileChange, onFileDrop, disabled }) {
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
      const file = e.dataTransfer.files?.[0];
      if (file) onFileDrop?.(file);
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
        'relative rounded-2xl border-2 border-dashed bg-white px-6 py-10 sm:px-10 sm:py-12 text-center transition-all duration-200',
        isDragging
          ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
          : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/40',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={onFileChange}
        className="sr-only"
        id="compress-pdf-upload"
      />

      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
          <rect x="12" y="8" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <path d="M20 20h8M18 28h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 34v6M21 37h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {isDragging ? 'Drop your PDF here' : 'Drop PDF to compress'}
      </h2>
      <p className="text-slate-500 mb-6 text-sm">
        One PDF at a time · Max {maxMb} MB · Processed on your device
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
      >
        Choose PDF file
      </button>
    </div>
  );
}
