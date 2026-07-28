import { SPLIT_MODES } from '../hooks/useSplitPdf';
import { formatFileSize } from '../utils/pageRanges';

const MODE_OPTIONS = [
  {
    id: SPLIT_MODES.EXTRACT,
    title: 'Extract pages',
    description: 'Keep selected pages in one PDF',
  },
  {
    id: SPLIT_MODES.EVERY_PAGE,
    title: 'Split every page',
    description: 'Each page becomes its own PDF (ZIP)',
  },
  {
    id: SPLIT_MODES.RANGES,
    title: 'Split by ranges',
    description: 'Each range becomes a separate PDF',
  },
];

export default function SplitWorkspace({
  file,
  pageCount,
  isLoading,
  loadError,
  mode,
  setMode,
  rangeInput,
  setRangeInput,
  isProcessing,
  onClear,
  onSplit,
}) {
  const needsRange =
    mode === SPLIT_MODES.EXTRACT || mode === SPLIT_MODES.RANGES;

  const rangeHint =
    mode === SPLIT_MODES.EXTRACT
      ? 'Example: 1-3, 5, 8-10 — selected pages become one PDF'
      : 'Example: 1-3, 4-6, 7 — each group becomes its own PDF';

  const canSplit =
    !isLoading &&
    !loadError &&
    pageCount > 0 &&
    !isProcessing &&
    (mode === SPLIT_MODES.EVERY_PAGE || rangeInput.trim().length > 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900 truncate" title={file.name}>
            {file.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatFileSize(file.size)}
            {isLoading ? ' · Reading…' : pageCount > 0 ? ` · ${pageCount} pages` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={isProcessing}
          className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
        >
          New file
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        ) : (
          <>
            <fieldset>
              <legend className="text-sm font-semibold text-slate-900 mb-3">
                Split mode
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MODE_OPTIONS.map((option) => {
                  const active = mode === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setMode(option.id)}
                      disabled={isProcessing}
                      className={[
                        'text-left rounded-xl border px-4 py-3 transition-colors',
                        active
                          ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                          : 'border-slate-200 bg-white hover:border-orange-300',
                      ].join(' ')}
                    >
                      <span className="block text-sm font-semibold text-slate-900">
                        {option.title}
                      </span>
                      <span className="block text-xs text-slate-500 mt-1 leading-relaxed">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {needsRange && (
              <div>
                <label
                  htmlFor="split-range-input"
                  className="block text-sm font-semibold text-slate-900 mb-2"
                >
                  Pages / ranges
                </label>
                <input
                  id="split-range-input"
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  disabled={isProcessing || isLoading}
                  placeholder="1-3, 5, 8-10"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />
                <p className="mt-2 text-xs text-slate-500">{rangeHint}</p>
              </div>
            )}

            {mode === SPLIT_MODES.EVERY_PAGE && pageCount > 0 && (
              <p className="text-sm text-slate-600 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                This will create <strong>{pageCount}</strong> PDF
                {pageCount === 1 ? '' : 's'} and download them as a ZIP file.
              </p>
            )}

            <button
              type="button"
              onClick={onSplit}
              disabled={!canSplit}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 disabled:opacity-40 disabled:hover:bg-orange-600 transition-colors"
            >
              {isProcessing
                ? 'Processing…'
                : mode === SPLIT_MODES.EVERY_PAGE
                  ? 'Split & Download ZIP'
                  : mode === SPLIT_MODES.RANGES
                    ? 'Split by ranges'
                    : 'Extract & Download'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
