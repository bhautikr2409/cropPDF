import { PAGE_SCOPE, ROTATION_OPTIONS } from '../hooks/useRotatePdf';
import { formatFileSize } from '../utils/rotatePdf';

export default function RotateWorkspace({
  file,
  pageCount,
  isLoading,
  loadError,
  scope,
  setScope,
  rangeInput,
  setRangeInput,
  rotationId,
  setRotationId,
  isProcessing,
  onClear,
  onRotate,
}) {
  const canRotate =
    !isLoading &&
    !loadError &&
    pageCount > 0 &&
    !isProcessing &&
    (scope === PAGE_SCOPE.ALL || rangeInput.trim().length > 0);

  return (
    <div className="rounded-3xl border border-ink-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-ink-100 bg-ink-50">
        <div className="min-w-0">
          <h2 className="font-semibold text-ink-900 truncate" title={file.name}>
            {file.name}
          </h2>
          <p className="text-xs text-ink-500 mt-0.5">
            {formatFileSize(file.size)}
            {isLoading ? ' · Reading…' : pageCount > 0 ? ` · ${pageCount} pages` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={isProcessing}
          className="px-3 py-2 text-sm font-medium text-ink-600 bg-white border border-ink-200 rounded-lg hover:bg-ink-50 disabled:opacity-40"
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
              <legend className="text-sm font-semibold text-ink-900 mb-3">Pages</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setScope(PAGE_SCOPE.ALL)}
                  disabled={isProcessing}
                  className={[
                    'text-left rounded-xl border px-4 py-3 transition-colors',
                    scope === PAGE_SCOPE.ALL
                      ? 'border-accent-500 bg-accent-50 ring-1 ring-accent-500'
                      : 'border-ink-200 bg-white hover:border-accent-300',
                  ].join(' ')}
                >
                  <span className="block text-sm font-semibold text-ink-900">All pages</span>
                  <span className="block text-xs text-ink-500 mt-1">
                    Rotate every page in the document
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setScope(PAGE_SCOPE.SELECTED)}
                  disabled={isProcessing}
                  className={[
                    'text-left rounded-xl border px-4 py-3 transition-colors',
                    scope === PAGE_SCOPE.SELECTED
                      ? 'border-accent-500 bg-accent-50 ring-1 ring-accent-500'
                      : 'border-ink-200 bg-white hover:border-accent-300',
                  ].join(' ')}
                >
                  <span className="block text-sm font-semibold text-ink-900">
                    Selected pages
                  </span>
                  <span className="block text-xs text-ink-500 mt-1">
                    Rotate only the pages you choose
                  </span>
                </button>
              </div>
            </fieldset>

            {scope === PAGE_SCOPE.SELECTED && (
              <div>
                <label
                  htmlFor="rotate-range-input"
                  className="block text-sm font-semibold text-ink-900 mb-2"
                >
                  Page numbers / ranges
                </label>
                <input
                  id="rotate-range-input"
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  disabled={isProcessing || isLoading}
                  placeholder="1-3, 5, 8-10"
                  className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-colors"
                />
                <p className="mt-2 text-xs text-ink-500">
                  Example: 1-3, 5, 8-10 (document has {pageCount || '—'} pages)
                </p>
              </div>
            )}

            <fieldset>
              <legend className="text-sm font-semibold text-ink-900 mb-3">Rotation</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROTATION_OPTIONS.map((option) => {
                  const active = rotationId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRotationId(option.id)}
                      disabled={isProcessing}
                      className={[
                        'text-left rounded-xl border px-4 py-3 transition-colors',
                        active
                          ? 'border-accent-500 bg-accent-50 ring-1 ring-accent-500'
                          : 'border-ink-200 bg-white hover:border-accent-300',
                      ].join(' ')}
                    >
                      <span className="block text-sm font-semibold text-ink-900">
                        {option.label}
                      </span>
                      <span className="block text-xs text-ink-500 mt-1">{option.hint}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={onRotate}
              disabled={!canRotate}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-accent-600 rounded-full hover:bg-accent-700 disabled:opacity-40 disabled:hover:bg-accent-600 transition-colors"
            >
              {isProcessing ? 'Rotating…' : 'Rotate & Download'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
