import { PAGE_SCOPE } from '../hooks/usePdfToMarkdown';
import { PAGE_BREAK_MODES, formatFileSize } from '../utils/markdownOptions';

export default function PdfToMarkdownWorkspace({
  file,
  pageCount,
  isLoading,
  loadError,
  scope,
  setScope,
  rangeInput,
  setRangeInput,
  pageBreakMode,
  setPageBreakMode,
  includeTitle,
  setIncludeTitle,
  isProcessing,
  progress,
  markdown,
  setMarkdown,
  onClear,
  onConvert,
  onDownload,
  onCopy,
}) {
  const canConvert =
    !isLoading &&
    !loadError &&
    pageCount > 0 &&
    !isProcessing &&
    (scope === PAGE_SCOPE.ALL || rangeInput.trim().length > 0);

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
              <legend className="text-sm font-semibold text-slate-900 mb-3">Pages</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: PAGE_SCOPE.ALL, title: 'All pages', text: 'Convert every page' },
                  { id: PAGE_SCOPE.SELECTED, title: 'Selected pages', text: 'Choose ranges to convert' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setScope(option.id)}
                    disabled={isProcessing}
                    className={[
                      'text-left rounded-xl border px-4 py-3 transition-colors',
                      scope === option.id
                        ? 'border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500'
                        : 'border-slate-200 bg-white hover:border-cyan-300',
                    ].join(' ')}
                  >
                    <span className="block text-sm font-semibold text-slate-900">{option.title}</span>
                    <span className="block text-xs text-slate-500 mt-1">{option.text}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {scope === PAGE_SCOPE.SELECTED && (
              <div>
                <label
                  htmlFor="pdf-md-range"
                  className="block text-sm font-semibold text-slate-900 mb-2"
                >
                  Page numbers / ranges
                </label>
                <input
                  id="pdf-md-range"
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  disabled={isProcessing || isLoading}
                  placeholder="1-3, 5, 8-10"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Example: 1-3, 5, 8-10 (document has {pageCount || '—'} pages)
                </p>
              </div>
            )}

            <fieldset>
              <legend className="text-sm font-semibold text-slate-900 mb-3">Page breaks</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.values(PAGE_BREAK_MODES).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPageBreakMode(option.id)}
                    disabled={isProcessing}
                    className={[
                      'text-left rounded-xl border px-4 py-3 transition-colors',
                      pageBreakMode === option.id
                        ? 'border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500'
                        : 'border-slate-200 bg-white hover:border-cyan-300',
                    ].join(' ')}
                  >
                    <span className="block text-sm font-semibold text-slate-900">{option.label}</span>
                    <span className="block text-xs text-slate-500 mt-1">{option.hint}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTitle}
                onChange={(e) => setIncludeTitle(e.target.checked)}
                disabled={isProcessing}
                className="mt-1 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  Include document title
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Prefaces the Markdown with a top-level heading from the file name
                </span>
              </span>
            </label>

            {isProcessing && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>
                    Reading page {progress.current} of {progress.total}…
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-cyan-600 transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onConvert}
                disabled={!canConvert}
                className="px-6 py-3 text-sm font-semibold text-white bg-cyan-600 rounded-xl hover:bg-cyan-700 disabled:opacity-40 disabled:hover:bg-cyan-600 transition-colors"
              >
                {isProcessing ? 'Converting…' : markdown ? 'Convert again' : 'Convert to Markdown'}
              </button>
              <button
                type="button"
                onClick={onCopy}
                disabled={!markdown || isProcessing}
                className="px-5 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={onDownload}
                disabled={!markdown || isProcessing}
                className="px-5 py-3 text-sm font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-xl hover:bg-cyan-100 disabled:opacity-40"
              >
                Download .md
              </button>
            </div>

            {markdown ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-900">Preview</h3>
                  <span className="text-xs text-slate-500">
                    {markdown.length.toLocaleString()} characters · editable
                  </span>
                </div>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  rows={16}
                  spellCheck={false}
                  className="w-full px-4 py-3 text-sm font-mono leading-relaxed text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-y min-h-[240px]"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Text-based PDFs convert best. Scanned/image-only PDFs may have little or no text.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Text is extracted in your browser. Headings and lists are detected from layout when
                possible.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
