import { useCallback, useRef, useState } from 'react';
import { MAX_PDF_BYTES } from '../../../constants';

export default function EditUpload({ onFileChange, onFileDrop, disabled }) {
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
        'relative rounded-[32px] border-2 border-dashed bg-white px-6 py-10 sm:px-10 sm:py-12 text-center transition-all duration-200',
        isDragging
          ? 'border-accent-500 bg-accent-50/70 scale-[1.01]'
          : 'border-accent-300 hover:border-accent-500 hover:bg-accent-50/60',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={onFileChange}
        className="sr-only"
        id="edit-pdf-upload"
      />

      <div className="mx-auto mb-5 flex h-16 w-16 -rotate-6 items-center justify-center rounded-[20px] bg-accent-500 text-white">
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
          <rect x="12" y="8" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <path d="M18 18h12M18 24h12M18 30h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="34" cy="34" r="8" fill="white" stroke="currentColor" strokeWidth="2.5" />
          <path d="M34 30v8M30 34h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-ink-900 mb-2">
        {isDragging ? 'Drop your PDF here' : 'Drop PDF to edit'}
      </h2>
      <p className="text-ink-500 mb-6 text-sm">
        Add text, images, shapes, or drawings · Max {maxMb} MB · Processed on your device
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 bg-accent-600 text-white px-7 py-3 rounded-full font-semibold hover:bg-accent-700 transition-colors"
      >
        Choose PDF file
      </button>
    </div>
  );
}
