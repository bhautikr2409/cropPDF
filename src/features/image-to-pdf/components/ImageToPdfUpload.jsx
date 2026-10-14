import { useCallback, useRef, useState } from 'react';
import { MAX_IMAGE_BYTES, MAX_IMAGE_FILES } from '../../../constants';

export default function ImageToPdfUpload({ onAddFiles, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const maxMb = Math.round(MAX_IMAGE_BYTES / (1024 * 1024));

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
    if (e.dataTransfer.files?.length) onAddFiles(e.dataTransfer.files);
  }, [disabled, onAddFiles]);

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
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        onChange={handleChange}
        className="sr-only"
        id="image-to-pdf-upload"
      />

      <div className="mx-auto mb-5 flex h-16 w-16 -rotate-6 items-center justify-center rounded-[20px] bg-accent-500 text-white">
        <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
          <rect x="10" y="12" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="18" cy="20" r="2.5" fill="currentColor" />
          <path d="M12 32l8-8 6 6 4-4 6 6H12z" fill="currentColor" opacity="0.35" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-ink-900 mb-2">
        {isDragging ? 'Drop images to add them' : 'Drop images here'}
      </h2>
      <p className="text-ink-500 mb-6 text-sm">
        JPG, PNG, or WEBP · Up to {MAX_IMAGE_FILES} images · {maxMb} MB each
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 bg-accent-600 text-white px-7 py-3 rounded-full font-semibold hover:bg-accent-700 transition-colors"
      >
        Choose images
      </button>
    </div>
  );
}
