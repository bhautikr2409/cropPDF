import { COMPRESS_LEVELS, formatFileSize } from '../utils/compressLevels';

export default function CompressWorkspace({
  file,
  pageCount,
  isLoading,
  loadError,
  level,
  setLevel,
  isProcessing,
  progress,
  lastResult,
  onClear,
  onCompress,
}) {
  const canCompress =
    !isLoading && !loadError && pageCount > 0 && !isProcessing;

  const progressPercent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

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
                Compression level
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.values(COMPRESS_LEVELS).map((option) => {
                  const active = level === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setLevel(option.id)}
                      disabled={isProcessing}
                      className={[
                        'text-left rounded-xl border px-4 py-3 transition-colors',
                        active
                          ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:border-emerald-300',
                      ].join(' ')}
                    >
                      <span className="block text-sm font-semibold text-slate-900">
                        {option.label}
                      </span>
                      <span className="block text-xs text-slate-500 mt-1 leading-relaxed">
                        {option.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-slate-600">
              Pages are recompressed as images for a smaller file. Text will no longer be
              selectable in the output — ideal for sharing and archiving.
            </div>

            {isProcessing && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>
                    Compressing page {progress.current} of {progress.total}…
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {lastResult && !isProcessing && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                <p className="font-semibold text-slate-900 mb-1">Last result</p>
                <p className="text-slate-600">
                  {formatFileSize(lastResult.originalSize)} →{' '}
                  {formatFileSize(lastResult.compressedSize)}
                  {lastResult.savedPercent != null && lastResult.savedPercent > 0
                    ? ` (${lastResult.savedPercent}% smaller)`
                    : lastResult.compressedSize >= lastResult.originalSize
                      ? ' (similar size)'
                      : ''}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onCompress}
              disabled={!canCompress}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-colors"
            >
              {isProcessing ? 'Compressing…' : 'Compress & Download'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
