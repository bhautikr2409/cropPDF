import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MAX_PDF_BYTES } from '../../../constants';

const FEATURES = [
  {
    title: '100% private',
    text: 'Your file never leaves this browser.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <path
          d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5C8 19.2 5 15.5 5 11V6l7-3z"
          className="stroke-blue-600"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M9.5 12l1.8 1.8L14.8 10" className="stroke-blue-600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Precise crop',
    text: 'Drag a box, resize handles, then download.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <rect x="4" y="5" width="12" height="14" rx="1.5" className="stroke-blue-600" strokeWidth="1.8" />
        <path d="M10 3v4M16 3v4M8 11h10M8 15h6" className="stroke-blue-600" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'All pages',
    text: 'The same relative crop applies to every page.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <rect x="5" y="4" width="10" height="14" rx="1.5" className="stroke-blue-600" strokeWidth="1.8" />
        <rect x="9" y="6" width="10" height="14" rx="1.5" className="fill-white stroke-blue-600" strokeWidth="1.8" />
      </svg>
    ),
  },
];

const STEPS = [
  { n: '1', title: 'Upload', text: 'Pick or drop a PDF' },
  { n: '2', title: 'Crop', text: 'Draw the area to keep' },
  { n: '3', title: 'Download', text: 'Save the cropped file' },
];

export default function UploadPDFPage({ onFileChange, onFileDrop }) {
  const maxMb = Math.round(MAX_PDF_BYTES / (1024 * 1024));
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

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
      const file = e.dataTransfer.files?.[0];
      if (file) onFileDrop?.(file);
    },
    [onFileDrop]
  );

  return (
    <div className="w-full">
      <div className="text-center mb-8 sm:mb-10">
        <p className="text-sm font-semibold text-blue-600 mb-2 tracking-wide uppercase">
          PDF Crop Tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Crop PDF online
        </h1>
    
      </div>

      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'relative rounded-2xl border-2 border-dashed bg-white px-6 py-12 sm:px-10 sm:py-16 text-center transition-all duration-200',
          isDragging
            ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/50',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={onFileChange}
          className="sr-only"
          id="crop-pdf-upload"
        />

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
            <path
              d="M24 8v20M24 8l-7 7M24 8l7 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 30v6a4 4 0 004 4h20a4 4 0 004-4v-6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          {isDragging ? 'Drop your PDF here' : 'Drop PDF here'}
        </h2>
        <p className="text-slate-500 mb-6">or click the button to browse your files</p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M9 2a1 1 0 012 0v9.6l2.3-2.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L9 11.6V2z" />
            <path d="M3 14a1 1 0 011 1v1h12v-1a1 1 0 112 0v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1a1 1 0 011-1z" />
          </svg>
          Choose PDF file
        </button>

        <p className="mt-5 text-xs text-slate-400">
          PDF only · Max {maxMb} MB · Processed on your device
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex gap-3 rounded-xl bg-white border border-slate-200 px-4 py-4"
          >
            <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{feature.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-white border border-slate-200 px-6 py-6 sm:px-8">
        <h3 className="text-sm font-semibold text-slate-900 mb-5 text-center sm:text-left">
          How it works
        </h3>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <li key={step.n} className="flex sm:flex-col items-center sm:items-start gap-3 text-left">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                {step.n}
              </span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Need help?{' '}
        <Link to="/guide" className="text-blue-600 font-medium hover:underline">
          Read the cropping guide
        </Link>
      </p>
    </div>
  );
}
