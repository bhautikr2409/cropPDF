import { formatFileSize } from '../utils/unlockPdf';

export default function UnlockWorkspace({
  file,
  isLoading,
  loadError,
  encryptionInfo,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isProcessing,
  onClear,
  onUnlock,
}) {
  const canUnlock =
    !isLoading &&
    !loadError &&
    encryptionInfo?.encrypted &&
    !isProcessing &&
    password.length > 0;

  return (
    <div className="rounded-3xl border border-ink-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-ink-100 bg-ink-50">
        <div className="min-w-0">
          <h2 className="font-semibold text-ink-900 truncate" title={file.name}>
            {file.name}
          </h2>
          <p className="text-xs text-ink-500 mt-0.5">
            {formatFileSize(file.size)}
            {isLoading
              ? ' · Checking…'
              : encryptionInfo?.encrypted
                ? ` · Encrypted (${encryptionInfo.algorithm || 'password'})`
                : ''}
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
            <div>
              <label htmlFor="unlock-password" className="block text-sm font-semibold text-ink-900 mb-2">
                PDF password
              </label>
              <div className="relative">
                <input
                  id="unlock-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isProcessing}
                  autoComplete="current-password"
                  placeholder="Enter the current password"
                  className="w-full px-4 py-2.5 pr-24 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canUnlock) onUnlock();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-ink-500 hover:text-ink-800"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-ink-600">
              Unlocking removes the password so the PDF opens without a prompt. Processing stays
              on your device.
            </div>

            <button
              type="button"
              onClick={onUnlock}
              disabled={!canUnlock}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-accent-800 rounded-xl hover:bg-accent-900 disabled:opacity-40 disabled:hover:bg-accent-800 transition-colors"
            >
              {isProcessing ? 'Unlocking…' : 'Unlock & Download'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
