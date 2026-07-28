import { Link } from 'react-router-dom';
import { useUnlockPdf } from '../hooks/useUnlockPdf';
import UnlockUpload from './UnlockUpload';
import UnlockWorkspace from './UnlockWorkspace';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Choose a protected PDF' },
  { n: '2', title: 'Enter password', text: 'Use the current PDF password' },
  { n: '3', title: 'Download', text: 'Get an unlocked PDF' },
];

export default function UnlockPDF() {
  const {
    file,
    isLoading,
    loadError,
    encryptionInfo,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isProcessing,
    loadFile,
    acceptFile,
    clearFile,
    runUnlock,
  } = useUnlockPdf();

  return (
    <div className="bg-[#f5f7fb] py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-stone-700 mb-2 tracking-wide uppercase">
              Unlock PDF
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Remove PDF password
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
              Decrypt a password-protected PDF locally in your browser. Your file and password
              never leave this device.
            </p>
          </div>

          {!file ? (
            <>
              <UnlockUpload
                onFileChange={loadFile}
                onFileDrop={acceptFile}
                disabled={isProcessing}
              />
              <div className="mt-10 rounded-2xl bg-white border border-slate-200 px-6 py-6 sm:px-8">
                <h3 className="text-sm font-semibold text-slate-900 mb-5">How it works</h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {STEPS.map((step) => (
                    <li key={step.n} className="flex sm:flex-col items-center sm:items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-800 text-white text-sm font-bold">
                        {step.n}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <UnlockWorkspace
              file={file}
              isLoading={isLoading}
              loadError={loadError}
              encryptionInfo={encryptionInfo}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isProcessing={isProcessing}
              onClear={clearFile}
              onUnlock={runUnlock}
            />
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Need to add a password?{' '}
            <Link to="/protect" className="text-stone-800 font-medium hover:underline">
              Open Protect PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
