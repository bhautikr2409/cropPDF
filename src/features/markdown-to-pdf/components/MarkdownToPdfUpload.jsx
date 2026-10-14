import { useCallback, useRef, useState } from 'react';
import { MAX_MARKDOWN_BYTES } from '../utils/markdownToPdf';

export default function MarkdownToPdfUpload({ onFileChange, onFileDrop, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const maxMb = Math.round(MAX_MARKDOWN_BYTES / (1024 * 1024));

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
        'rounded-[32px] border-2 border-dashed bg-white px-6 py-8 text-center transition-all sm:px-8',
        isDragging
          ? 'scale-[1.01] border-accent-500 bg-accent-50/70'
          : 'border-accent-300 hover:border-accent-500 hover:bg-accent-50/60',
        disabled ? 'pointer-events-none opacity-60' : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".md,.markdown,.txt,.mdown,.mkd,text/markdown,text/plain"
        onChange={onFileChange}
        className="sr-only"
        id="markdown-to-pdf-upload"
      />

      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <path
            d="M5 4h9l5 5v11a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M14 4v5h5M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <h3 className="mb-1 text-base font-bold text-ink-900">
        {isDragging ? 'Drop Markdown here' : 'Upload a Markdown file'}
      </h3>
      <p className="mb-4 text-xs text-ink-500">
        .md, .markdown, or .txt · Max {maxMb} MB · Local only
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center rounded-full bg-accent-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600"
      >
        Choose file
      </button>
    </div>
  );
}
