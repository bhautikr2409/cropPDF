import { Link } from 'react-router-dom';
import { useProtectPdf } from '../hooks/useProtectPdf';
import ProtectUpload from './ProtectUpload';
import ProtectWorkspace from './ProtectWorkspace';
import ToolSeoSection from '../../../components/seo/ToolSeoSection';
import ToolHeading from '../../../components/tools/ToolHeading';

const STEPS = [
  { n: '1', title: 'Upload', text: 'Choose an unprotected PDF' },
  { n: '2', title: 'Set password', text: 'Choose a strong password' },
  { n: '3', title: 'Download', text: 'Get your encrypted PDF' },
];

export default function ProtectPDF() {
  const {
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
    loadFile,
    acceptFile,
    clearFile,
    runProtect,
  } = useProtectPdf();

  return (
    <div className="cat-security tool-page pb-20 pt-10 sm:pt-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <ToolHeading toolId="protect" />
            <h1 className="mb-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Password-protect a PDF
            </h1>
            <p className="text-ink-600 max-w-xl mx-auto text-base sm:text-lg">
              Encrypt your document with AES-256. Everything runs locally — your file and
              password never leave this device.
            </p>
          </div>

          {!file ? (
            <>
              <ProtectUpload
                onFileChange={loadFile}
                onFileDrop={acceptFile}
                disabled={isProcessing}
              />
              <div className="mt-10 rounded-3xl bg-white border border-ink-200 px-6 py-6 sm:px-8">
                <h3 className="text-sm font-semibold text-ink-900 mb-5">How it works</h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {STEPS.map((step) => (
                    <li key={step.n} className="flex sm:flex-col items-center sm:items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white text-sm font-bold">
                        {step.n}
                      </span>
                      <div>
                        <p className="font-semibold text-ink-900 text-sm">{step.title}</p>
                        <p className="text-xs text-ink-500 mt-0.5">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <ProtectWorkspace
              file={file}
              isLoading={isLoading}
              loadError={loadError}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              allowPrinting={allowPrinting}
              setAllowPrinting={setAllowPrinting}
              allowCopying={allowCopying}
              setAllowCopying={setAllowCopying}
              allowModifying={allowModifying}
              setAllowModifying={setAllowModifying}
              isProcessing={isProcessing}
              onClear={clearFile}
              onProtect={runProtect}
            />
          )}

          <ToolSeoSection toolId="protect" />

          <p className="mt-6 text-center text-sm text-ink-500">
            Need to remove a password?{' '}
            <Link to="/unlock" className="text-accent-700 font-medium hover:underline">
              Open Unlock PDF
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
