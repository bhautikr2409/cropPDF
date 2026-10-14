import { useCallback, useRef, useState } from 'react';
import { MAX_PDF_BYTES } from '../../../constants';

export default function ProtectUpload({ onFileChange, onFileDrop, disabled }) {
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
        id="protect-pdf-upload"
      />

      <div className="mx-auto mb-5 flex h-16 w-16 -rotate-6 items-center justify-center rounded-[20px] bg-accent-500 text-white">
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
          <rect x="12" y="20" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <path d="M16 20v-4a8 8 0 0116 0v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="29" r="2.5" fill="currentColor" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-ink-900 mb-2">
        {isDragging ? 'Drop your PDF here' : 'Drop PDF to protect'}
      </h2>
      <p className="text-ink-500 mb-6 text-sm">
        Add a password with AES-256 encryption · Max {maxMb} MB
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
