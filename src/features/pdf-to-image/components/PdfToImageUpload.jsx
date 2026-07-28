import { useCallback, useRef, useState } from 'react';
import { MAX_PDF_BYTES } from '../../../constants';

export default function PdfToImageUpload({ onFileChange, onFileDrop, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const maxMb = Math.round(MAX_PDF_BYTES / (1024 * 1024));

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileDrop?.(file);
  }, [disabled, onFileDrop]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'relative rounded-2xl border-2 border-dashed bg-white px-6 py-10 sm:px-10 sm:py-12 text-center transition-all duration-200',
        isDragging
          ? 'border-sky-500 bg-sky-50/70 scale-[1.01]'
          : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50/40',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={onFileChange}
        className="sr-only"
        id="pdf-to-image-upload"
      />

      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
          <rect x="8" y="10" width="20" height="28" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <rect x="22" y="16" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="28" cy="22" r="2" fill="currentColor" />
          <path d="M24 30l4-4 4 3 4-5v6H24z" fill="currentColor" opacity="0.35" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {isDragging ? 'Drop your PDF here' : 'Drop PDF to convert'}
      </h2>
      <p className="text-slate-500 mb-6 text-sm">
        Export pages as PNG or JPEG · Max {maxMb} MB
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors shadow-sm"
      >
        Choose PDF file
      </button>
    </div>
  );
}
