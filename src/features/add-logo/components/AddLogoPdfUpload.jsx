import { useCallback, useRef, useState } from 'react';
import { MAX_PDF_BYTES } from '../../../constants';

export default function AddLogoPdfUpload({ onFileChange, onFileDrop, disabled }) {
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
        'relative rounded-[32px] border-2 border-dashed bg-white px-6 py-10 text-center transition-all duration-200 sm:px-10 sm:py-12',
        isDragging
          ? 'scale-[1.01] border-accent-500 bg-accent-50/70'
          : 'border-accent-300 hover:border-accent-500 hover:bg-accent-50/60',
        disabled ? 'pointer-events-none opacity-60' : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={onFileChange}
        className="sr-only"
        id="add-logo-pdf-upload"
      />

      <div className="mx-auto mb-5 flex h-16 w-16 -rotate-6 items-center justify-center rounded-[20px] bg-accent-500 text-white">
        <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8" aria-hidden="true">
          <rect x="10" y="6" width="22" height="30" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M16 14h10M16 20h10M16 26h6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <rect
            x="26"
            y="24"
            width="12"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M29 30h6M32 27v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="mb-1 text-sm font-semibold text-accent-700">Step 1</p>
      <h2 className="mb-2 text-xl font-bold text-ink-900">
        {isDragging ? 'Drop your PDF here' : 'Upload your PDF'}
      </h2>
      <p className="mb-6 text-sm text-ink-500">
        Shipping labels, invoices, or any multi-page PDF · Max {maxMb} MB
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-accent-700"
      >
        Choose PDF file
      </button>
    </div>
  );
}
