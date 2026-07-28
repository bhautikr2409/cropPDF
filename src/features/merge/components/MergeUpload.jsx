import { useCallback, useRef, useState } from 'react';
import { MAX_MERGE_FILES, MAX_PDF_BYTES } from '../../../constants';

export default function MergeUpload({ onAddFiles, disabled }) {
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

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files;
      if (dropped?.length) onAddFiles(dropped);
    },
    [disabled, onAddFiles]
  );

  const handleChange = (e) => {
    if (e.target.files?.length) {
      onAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'relative rounded-2xl border-2 border-dashed bg-white px-6 py-10 sm:px-10 sm:py-12 text-center transition-all duration-200',
        isDragging
          ? 'border-rose-500 bg-rose-50/70 scale-[1.01]'
          : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50/40',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={handleChange}
        className="sr-only"
        id="merge-pdf-upload"
      />

      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
          <rect x="6" y="12" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <rect x="26" y="12" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <path d="M20 23h8M24 19v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {isDragging ? 'Drop PDFs to add them' : 'Drop PDF files here'}
      </h2>
      <p className="text-slate-500 mb-6 text-sm">
        Select multiple files — up to {MAX_MERGE_FILES} PDFs, {maxMb} MB each
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-sm"
      >
        Choose PDF files
      </button>
    </div>
  );
}
