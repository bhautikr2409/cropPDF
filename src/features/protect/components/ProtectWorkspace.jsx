import { formatFileSize } from '../utils/protectPdf';

export default function ProtectWorkspace({
  file,
  isLoading,
  loadError,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  allowPrinting,
  setAllowPrinting,
  allowCopying,
  setAllowCopying,
  allowModifying,
  setAllowModifying,
  isProcessing,
  onClear,
  onProtect,
}) {
  const canProtect =
    !isLoading &&
    !loadError &&
    !isProcessing &&
    password.length >= 4 &&
    password === confirmPassword;

  return (
    <div className="rounded-3xl border border-ink-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-ink-100 bg-ink-50">
        <div className="min-w-0">
          <h2 className="font-semibold text-ink-900 truncate" title={file.name}>
            {file.name}
          </h2>
          <p className="text-xs text-ink-500 mt-0.5">
            {formatFileSize(file.size)}
            {isLoading ? ' · Checking…' : ''}
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
              <label htmlFor="protect-password" className="block text-sm font-semibold text-ink-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="protect-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isProcessing}
                  autoComplete="new-password"
                  placeholder="At least 4 characters"
                  className="w-full px-4 py-2.5 pr-24 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500"
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

            <div>
              <label htmlFor="protect-confirm" className="block text-sm font-semibold text-ink-900 mb-2">
                Confirm password
              </label>
              <input
                id="protect-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isProcessing}
                autoComplete="new-password"
                placeholder="Re-enter password"
                className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-xs text-red-600">Passwords do not match.</p>
              )}
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-ink-900 mb-3">Permissions</legend>
              <div className="space-y-2">
                {[
                  { id: 'print', label: 'Allow printing', checked: allowPrinting, onChange: setAllowPrinting },
                  { id: 'copy', label: 'Allow copying text and images', checked: allowCopying, onChange: setAllowCopying },
                  { id: 'modify', label: 'Allow modifying the document', checked: allowModifying, onChange: setAllowModifying },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-ink-200 px-4 py-3 cursor-pointer hover:border-accent-300"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      disabled={isProcessing}
                      className="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="text-sm text-ink-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={onProtect}
              disabled={!canProtect}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-accent-600 rounded-full hover:bg-accent-700 disabled:opacity-40 disabled:hover:bg-accent-600 transition-colors"
            >
              {isProcessing ? 'Protecting…' : 'Protect & Download'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
