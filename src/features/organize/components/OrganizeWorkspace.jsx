import { useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { formatFileSize } from '../utils/organizePdf';

const THUMB_WIDTH = 128;

function PageCard({
  page,
  index,
  total,
  selected,
  previewUrl,
  disabled,
  onToggleSelect,
  onRemove,
  onMove,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const label =
    page.kind === 'inserted'
      ? `Added · p.${page.pageNumber}`
      : `Original · p.${page.pageNumber}`;

  return (
    <li
      draggable={!disabled}
      onDragStart={(e) => onDragStart(e, page.id)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, page.id)}
      className={[
        'group relative flex flex-col overflow-hidden rounded-xl border bg-white transition-shadow',
        selected
          ? 'border-accent-500 ring-2 ring-accent-500/30 shadow-md'
          : 'border-ink-200 hover:border-accent-300 hover:shadow-sm',
        disabled ? 'opacity-60' : 'cursor-grab active:cursor-grabbing',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => onToggleSelect(page.id)}
        disabled={disabled}
        className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md border border-ink-200 bg-white/95 text-accent-600 shadow-sm"
        aria-label={selected ? `Deselect page ${index + 1}` : `Select page ${index + 1}`}
        aria-pressed={selected}
      >
        {selected ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="h-2.5 w-2.5 rounded-sm border border-ink-300" />
        )}
      </button>

      <div className="flex min-h-[160px] items-center justify-center bg-ink-100 p-3">
        {previewUrl ? (
          <Document
            file={previewUrl}
            loading={
              <div className="h-36 w-24 animate-pulse rounded bg-ink-200" />
            }
            error={
              <div className="px-2 text-center text-xs text-red-600">Preview failed</div>
            }
          >
            <Page
              pageNumber={page.pageNumber}
              width={THUMB_WIDTH}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-sm"
            />
          </Document>
        ) : (
          <div className="h-36 w-24 rounded bg-ink-200" />
        )}
      </div>

      <div className="flex items-center justify-between gap-1 border-t border-ink-100 px-2 py-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink-900">{index + 1}</p>
          <p className="truncate text-[10px] text-ink-500" title={page.label || label}>
            {page.kind === 'inserted' && page.label ? page.label : label}
          </p>
        </div>
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={() => onMove(page.id, 'up')}
            disabled={disabled || index === 0}
            className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 disabled:opacity-30"
            aria-label={`Move page ${index + 1} earlier`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M10 4l-5 5h3v7h4V9h3l-5-5z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onMove(page.id, 'down')}
            disabled={disabled || index === total - 1}
            className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 disabled:opacity-30"
            aria-label={`Move page ${index + 1} later`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M10 16l5-5h-3V4H8v7H5l5 5z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onRemove(page.id)}
            disabled={disabled || total <= 1}
            className="rounded-md p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
            aria-label={`Delete page ${index + 1}`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path
                fillRule="evenodd"
                d="M6 4h8l1 1h3v2H2V5h3l1-1zm1 5h2v7H7V9zm4 0h2v7h-2V9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}

export default function OrganizeWorkspace({
  file,
  pages,
  selectedIds,
  isLoading,
  loadError,
  isProcessing,
  isInserting,
  hasChanges,
  onClear,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onRemoveSelected,
  onRemoveOne,
  onMove,
  onReorder,
  onReset,
  onLoadInsert,
  onOrganize,
  getPagePreviewUrl,
}) {
  const dragIdRef = useRef(null);
  const insertInputRef = useRef(null);
  const disabled = isProcessing || isInserting || isLoading;
  const selectedCount = selectedIds.size;

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

  const canSave = pages.length > 0 && !disabled && !loadError;

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-ink-900" title={file.name}>
            {file.name}
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">
            {formatFileSize(file.size)}
            {isLoading
              ? ' · Reading…'
              : ` · ${pages.length} page${pages.length === 1 ? '' : 's'} in document`}
            {hasChanges ? ' · edited' : ''}
            {' · drag to reorder'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 disabled:opacity-40"
        >
          New file
        </button>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onSelectAll}
                disabled={disabled || pages.length === 0}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-40"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={onClearSelection}
                disabled={disabled || selectedCount === 0}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-40"
              >
                Clear selection
              </button>
              <button
                type="button"
                onClick={onRemoveSelected}
                disabled={disabled || selectedCount === 0 || pages.length <= selectedCount}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-40"
              >
                Delete selected{selectedCount > 0 ? ` (${selectedCount})` : ''}
              </button>
              <button
                type="button"
                onClick={() => insertInputRef.current?.click()}
                disabled={disabled}
                className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm font-medium text-accent-700 hover:bg-accent-100 disabled:opacity-40"
              >
                {isInserting ? 'Adding…' : 'Add PDF pages'}
              </button>
              <input
                ref={insertInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={onLoadInsert}
                className="sr-only"
              />
              <button
                type="button"
                onClick={onReset}
                disabled={disabled || !hasChanges}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-40"
              >
                Reset
              </button>
              <p className="w-full text-xs text-ink-500 sm:ml-auto sm:w-auto">
                Added pages insert after your selection (or at the end).
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-sm text-ink-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-200 border-t-accent-600" />
                  Loading pages…
                </span>
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {pages.map((page, index) => (
                  <PageCard
                    key={page.id}
                    page={page}
                    index={index}
                    total={pages.length}
                    selected={selectedIds.has(page.id)}
                    previewUrl={getPagePreviewUrl(page)}
                    disabled={disabled}
                    onToggleSelect={onToggleSelect}
                    onRemove={onRemoveOne}
                    onMove={onMove}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                  />
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={onOrganize}
              disabled={!canSave}
              className="w-full rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-700 disabled:opacity-40 disabled:hover:bg-accent-600 sm:w-auto"
            >
              {isProcessing ? 'Saving…' : 'Save organized PDF'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
