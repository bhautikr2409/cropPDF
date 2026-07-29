import { useRef } from 'react';
import MarkdownToPdfUpload from './MarkdownToPdfUpload';
import MarkdownToolbar from './MarkdownToolbar';
import TypefacePicker from './TypefacePicker';
import { INPUT_MODES } from '../hooks/useMarkdownToPdf';

export default function MarkdownToPdfWorkspace({
  mode,
  setMode,
  markdown,
  setMarkdown,
  fileMeta,
  isProcessing,
  previewTab,
  setPreviewTab,
  previewHtml,
  charCount,
  canDownload,
  typefaceId,
  setTypefaceId,
  typeface,
  onFileChange,
  onFileDrop,
  onClear,
  onLoadSample,
  onDownload,
  formatFileSize,
}) {
  const textareaRef = useRef(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900">Markdown source</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {fileMeta
                  ? `${fileMeta.name} · ${formatFileSize(fileMeta.size)}`
                  : 'Paste or upload · processed on your device'}
                {` · ${charCount.toLocaleString()} characters`}
                {typeface ? ` · ${typeface.name}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onLoadSample}
                disabled={isProcessing}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Load sample
              </button>
              <button
                type="button"
                onClick={onClear}
                disabled={isProcessing || !markdown}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              {[
                { id: INPUT_MODES.PASTE, label: 'Paste Markdown' },
                { id: INPUT_MODES.UPLOAD, label: 'Upload file' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id)}
                  disabled={isProcessing}
                  className={[
                    'rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                    mode === tab.id
                      ? 'bg-white text-lime-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {mode === INPUT_MODES.UPLOAD ? (
              <MarkdownToPdfUpload
                onFileChange={onFileChange}
                onFileDrop={onFileDrop}
                disabled={isProcessing}
              />
            ) : null}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="md-source" className="mb-2 block text-sm font-semibold text-slate-900">
                  Editor
                </label>
                <MarkdownToolbar
                  textareaRef={textareaRef}
                  markdown={markdown}
                  setMarkdown={setMarkdown}
                  disabled={isProcessing}
                />
                <textarea
                  ref={textareaRef}
                  id="md-source"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  disabled={isProcessing}
                  spellCheck={false}
                  placeholder={'# Heading\n\nWrite or paste Markdown here…'}
                  className="h-[28rem] w-full resize-y rounded-b-xl rounded-t-none border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-relaxed text-slate-800 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 disabled:opacity-60"
                />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">Preview</p>
                  <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                    {[
                      { id: 'preview', label: 'Rendered' },
                      { id: 'source', label: 'Raw' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPreviewTab(tab.id)}
                        className={[
                          'rounded-md px-2.5 py-1 text-xs font-semibold transition',
                          previewTab === tab.id
                            ? 'bg-white text-slate-800 shadow-sm'
                            : 'text-slate-500',
                        ].join(' ')}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[30.25rem] overflow-auto rounded-xl border border-slate-200 bg-white px-4 py-3">
                  {previewTab === 'source' ? (
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-slate-700">
                      {markdown || 'Nothing to preview yet.'}
                    </pre>
                  ) : markdown.trim() ? (
                    <div
                      className="md-preview prose-sm max-w-none text-slate-800"
                      style={{ fontFamily: typeface?.cssFamily }}
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  ) : (
                    <p className="text-sm text-slate-500">
                      Paste or upload Markdown to preview it here.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onDownload}
              disabled={!canDownload}
              className="w-full rounded-xl bg-lime-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-lime-600 disabled:opacity-40 sm:w-auto"
            >
              {isProcessing ? 'Creating PDF…' : `Download PDF · ${typeface?.name || 'Font'}`}
            </button>
          </div>
        </div>

        <TypefacePicker
          value={typefaceId}
          onChange={setTypefaceId}
          disabled={isProcessing}
        />
      </div>

      <style>{`
        .md-preview h1 { font-size: 1.6rem; font-weight: 800; margin: 0 0 0.75rem; line-height: 1.25; }
        .md-preview h2 { font-size: 1.3rem; font-weight: 700; margin: 1.25rem 0 0.6rem; }
        .md-preview h3 { font-size: 1.1rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .md-preview h4, .md-preview h5, .md-preview h6 { font-size: 1rem; font-weight: 600; margin: 0.85rem 0 0.4rem; }
        .md-preview p { margin: 0 0 0.75rem; line-height: 1.6; }
        .md-preview ul, .md-preview ol { margin: 0 0 0.75rem; padding-left: 1.25rem; }
        .md-preview li { margin: 0.2rem 0; }
        .md-preview blockquote {
          margin: 0 0 0.75rem;
          padding: 0.4rem 0.75rem;
          border-left: 3px solid #84cc16;
          background: #f7fee7;
          color: #3f6212;
        }
        .md-preview pre {
          margin: 0 0 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: #f1f5f9;
          overflow: auto;
          font-size: 0.8rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .md-preview code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.85em;
          background: #f1f5f9;
          padding: 0.1rem 0.3rem;
          border-radius: 0.25rem;
        }
        .md-preview pre code { background: transparent; padding: 0; }
        .md-preview a { color: #4d7c0f; text-decoration: underline; }
        .md-preview hr { border: 0; border-top: 1px solid #e2e8f0; margin: 1rem 0; }
        .md-preview table { width: 100%; border-collapse: collapse; margin: 0 0 0.75rem; font-size: 0.875rem; }
        .md-preview th, .md-preview td { border: 1px solid #e2e8f0; padding: 0.4rem 0.5rem; text-align: left; }
        .md-preview th { background: #f8fafc; }
        .md-preview img { max-width: 100%; height: auto; }
      `}</style>
    </div>
  );
}
