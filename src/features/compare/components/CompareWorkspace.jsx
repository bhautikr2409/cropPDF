import { Document, Page } from 'react-pdf';
import { ZOOM } from '../../../constants';
import { VIEW_MODES } from '../hooks/useComparePdf';
import { formatFileSize } from '../utils/textDiff';

const MODE_OPTIONS = [
  { id: VIEW_MODES.SIDE, label: 'Side by side', hint: 'Compare pages next to each other' },
  { id: VIEW_MODES.OVERLAY, label: 'Overlay', hint: 'Stack pages and fade the revised version' },
  { id: VIEW_MODES.TEXT, label: 'Text diff', hint: 'Highlight added and removed words' },
];

function PdfPane({ label, fileName, fileUrl, pageNumber, pageCount, scale }) {
  const hasPage = pageNumber <= pageCount && pageCount > 0;

  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="truncate text-sm font-medium text-slate-800" title={fileName}>
            {fileName}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          {pageCount} pg
        </span>
      </div>

      <div className="flex flex-1 justify-center overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-3 sm:p-4 min-h-[280px]">
        {!fileUrl ? (
          <div className="flex items-center text-sm text-slate-500">Preparing…</div>
        ) : !hasPage ? (
          <div className="flex items-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
            No page {pageNumber} in this document
          </div>
        ) : (
          <Document
            file={fileUrl}
            loading={
              <div className="rounded-lg bg-white px-8 py-10 text-sm text-slate-500 shadow-sm">
                Loading PDF…
              </div>
            }
            error={
              <div className="rounded-lg border border-red-200 bg-white px-6 py-8 text-sm text-red-700">
                Failed to load PDF.
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="bg-white shadow-md"
            />
          </Document>
        )}
      </div>
    </div>
  );
}

function DiffText({ parts, isDiffing }) {
  if (isDiffing) {
    return <p className="text-sm text-slate-500">Comparing page text…</p>;
  }

  const hasContent = parts.some((p) => p.text.trim().length > 0);
  if (!hasContent) {
    return (
      <p className="text-sm text-slate-500">
        No extractable text on this page. Scanned or image-only pages won&apos;t show a word
        diff — use side-by-side or overlay instead.
      </p>
    );
  }

  return (
    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">
      {parts.map((part, i) => {
        if (part.type === 'add') {
          return (
            <mark
              key={i}
              className="rounded-sm bg-emerald-200/90 px-0.5 text-emerald-950"
              title="Added in revised"
            >
              {part.text}
            </mark>
          );
        }
        if (part.type === 'remove') {
          return (
            <mark
              key={i}
              className="rounded-sm bg-rose-200/90 px-0.5 text-rose-950 line-through decoration-rose-400"
              title="Removed from original"
            >
              {part.text}
            </mark>
          );
        }
        return <span key={i}>{part.text}</span>;
      })}
    </div>
  );
}

export default function CompareWorkspace({
  leftFile,
  rightFile,
  leftUrl,
  rightUrl,
  leftPages,
  rightPages,
  maxPages,
  currentPage,
  setCurrentPage,
  scale,
  setScale,
  viewMode,
  setViewMode,
  overlayOpacity,
  setOverlayOpacity,
  isLoading,
  loadError,
  diffParts,
  diffSummary,
  isDiffing,
  onSwap,
  onClear,
}) {
  const zoomPct = Math.round(scale * 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900">Document comparison</h2>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {leftFile?.name}
            <span className="mx-1.5 text-slate-300">vs</span>
            {rightFile?.name}
            {isLoading
              ? ' · Reading…'
              : ` · ${formatFileSize(leftFile?.size || 0)} / ${formatFileSize(rightFile?.size || 0)}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSwap}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Swap
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            New comparison
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {diffSummary.changed ? (
                <>
                  <span className="inline-flex items-center rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    −{diffSummary.removed} removed
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    +{diffSummary.added} added
                  </span>
                  <span className="text-xs text-slate-500">on this page (text)</span>
                </>
              ) : (
                <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {isDiffing ? 'Diffing text…' : 'No text changes on this page'}
                </span>
              )}
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-900">View</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {MODE_OPTIONS.map((option) => {
                  const active = viewMode === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setViewMode(option.id)}
                      className={[
                        'rounded-xl border px-3 py-2.5 text-left transition-colors',
                        active
                          ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white hover:border-indigo-300',
                      ].join(' ')}
                    >
                      <span className="block text-sm font-semibold text-slate-900">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">{option.hint}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  ←
                </button>
                <span className="min-w-[5.5rem] text-center text-sm font-medium text-slate-700">
                  {currentPage} / {maxPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(maxPages, p + 1))}
                  disabled={currentPage >= maxPages}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  aria-label="Next page"
                >
                  →
                </button>
              </div>

              {viewMode !== VIEW_MODES.TEXT ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setScale((s) => Math.max(ZOOM.MIN, +(s - ZOOM.STEP).toFixed(2)))}
                    disabled={scale <= ZOOM.MIN}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                  <span className="min-w-[3.5rem] text-center text-sm font-medium text-slate-700">
                    {zoomPct}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setScale((s) => Math.min(ZOOM.MAX, +(s + ZOOM.STEP).toFixed(2)))}
                    disabled={scale >= ZOOM.MAX}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                </div>
              ) : null}

              {viewMode === VIEW_MODES.OVERLAY ? (
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-medium">Revised opacity</span>
                  <input
                    type="range"
                    min={0.1}
                    max={0.9}
                    step={0.05}
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-28 accent-indigo-600"
                  />
                  <span className="tabular-nums">{Math.round(overlayOpacity * 100)}%</span>
                </label>
              ) : null}
            </div>

            {viewMode === VIEW_MODES.SIDE ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <PdfPane
                  label="Original"
                  fileName={leftFile?.name}
                  fileUrl={leftUrl}
                  pageNumber={currentPage}
                  pageCount={leftPages}
                  scale={scale}
                />
                <PdfPane
                  label="Revised"
                  fileName={rightFile?.name}
                  fileUrl={rightUrl}
                  pageNumber={currentPage}
                  pageCount={rightPages}
                  scale={scale}
                />
              </div>
            ) : null}

            {viewMode === VIEW_MODES.OVERLAY ? (
              <div>
                <div className="mb-2 flex flex-wrap gap-3 px-1 text-xs text-slate-500">
                  <span>
                    <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-slate-400" />
                    Original (base)
                  </span>
                  <span>
                    <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-indigo-500" />
                    Revised (overlay)
                  </span>
                </div>
                <div className="flex justify-center overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-4 min-h-[320px]">
                  {leftUrl && rightUrl ? (
                    <div className="relative inline-block shadow-md">
                      {currentPage <= leftPages ? (
                        <Document file={leftUrl} loading={null} error={null}>
                          <Page
                            pageNumber={currentPage}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="bg-white"
                          />
                        </Document>
                      ) : (
                        <div className="bg-white px-10 py-16 text-sm text-slate-500">
                          Original has no page {currentPage}
                        </div>
                      )}
                      {currentPage <= rightPages ? (
                        <div
                          className="pointer-events-none absolute inset-0 overflow-hidden"
                          style={{ opacity: overlayOpacity }}
                        >
                          <Document file={rightUrl} loading={null} error={null}>
                            <Page
                              pageNumber={currentPage}
                              scale={scale}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="bg-transparent"
                            />
                          </Document>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">Preparing overlay…</div>
                  )}
                </div>
              </div>
            ) : null}

            {viewMode === VIEW_MODES.TEXT ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span>
                    <mark className="rounded-sm bg-rose-200/90 px-1 line-through">removed</mark>
                    {' '}from original
                  </span>
                  <span>
                    <mark className="rounded-sm bg-emerald-200/90 px-1">added</mark>
                    {' '}in revised
                  </span>
                </div>
                <DiffText parts={diffParts} isDiffing={isDiffing} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
