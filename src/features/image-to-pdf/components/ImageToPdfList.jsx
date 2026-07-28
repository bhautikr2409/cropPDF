import { useRef } from 'react';
import { formatFileSize } from '../utils/validateImages';

function ImageRow({ item, index, total, onMove, onRemove, onDragStart, onDragOver, onDrop }) {
  return (
    <li
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragOver={(e) => onDragOver(e, item.id)}
      onDrop={(e) => onDrop(e, item.id)}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:px-4 hover:border-indigo-200 transition-colors"
    >
      <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 cursor-grab active:cursor-grabbing" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M7 5h2v2H7V5zm4 0h2v2h-2V5zM7 9h2v2H7V9zm4 0h2v2h-2V9zm-4 4h2v2H7v-2zm4 0h2v2h-2v-2z" />
        </svg>
      </span>

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold">
        {index + 1}
      </span>

      <img
        src={item.previewUrl}
        alt=""
        className="h-12 w-12 rounded-lg object-cover border border-slate-100 bg-slate-50"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900 text-sm" title={item.file.name}>
          {item.file.name}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(item.file.size)}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onMove(item.id, 'up')}
          disabled={index === 0}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          aria-label={`Move ${item.file.name} up`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 4l-5 5h3v7h4V9h3l-5-5z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onMove(item.id, 'down')}
          disabled={index === total - 1}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          aria-label={`Move ${item.file.name} down`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 16l5-5h-3V4H8v7H5l5 5z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
          aria-label={`Remove ${item.file.name}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M6 4h8l1 1h3v2H2V5h3l1-1zm1 5h2v7H7V9zm4 0h2v7h-2V9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </li>
  );
}

export default function ImageToPdfList({
  files,
  pageSize,
  setPageSize,
  onMove,
  onRemove,
  onReorder,
  onClear,
  onConvert,
  isProcessing,
  totalBytes,
}) {
  const dragIdRef = useRef(null);

  const onDragStart = (e, id) => {
    dragIdRef.current = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e, toId) => {
    e.preventDefault();
    const fromId = dragIdRef.current || e.dataTransfer.getData('text/plain');
    if (fromId) onReorder(fromId, toId);
    dragIdRef.current = null;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div>
          <h2 className="font-semibold text-slate-900">Images to convert</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {files.length} image{files.length === 1 ? '' : 's'}
            {totalBytes > 0 ? ` · ${formatFileSize(totalBytes)}` : ''}
            {' · '}drag to reorder
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            disabled={isProcessing || files.length === 0}
            className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onConvert}
            disabled={isProcessing || files.length < 1}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            {isProcessing ? 'Creating…' : 'Convert to PDF'}
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-5 pt-4">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900 mb-3">Page size</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setPageSize('fit')}
              disabled={isProcessing}
              className={[
                'text-left rounded-xl border px-4 py-3 transition-colors',
                pageSize === 'fit'
                  ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-indigo-300',
              ].join(' ')}
            >
              <span className="block text-sm font-semibold text-slate-900">Fit to image</span>
              <span className="block text-xs text-slate-500 mt-1">
                Each page matches the image dimensions
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPageSize('a4')}
              disabled={isProcessing}
              className={[
                'text-left rounded-xl border px-4 py-3 transition-colors',
                pageSize === 'a4'
                  ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-indigo-300',
              ].join(' ')}
            >
              <span className="block text-sm font-semibold text-slate-900">A4 page</span>
              <span className="block text-xs text-slate-500 mt-1">
                Center image on an A4 page
              </span>
            </button>
          </div>
        </fieldset>
      </div>

      <ul className="p-3 sm:p-4 space-y-2">
        {files.map((item, index) => (
          <ImageRow
            key={item.id}
            item={item}
            index={index}
            total={files.length}
            onMove={onMove}
            onRemove={onRemove}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </ul>
    </div>
  );
}
