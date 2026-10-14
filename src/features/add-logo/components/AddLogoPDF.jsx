import ToolSeoSection from '../../../components/seo/ToolSeoSection';
import { useAddLogo } from '../hooks/useAddLogo';
import AddLogoImageUpload from './AddLogoImageUpload';
import AddLogoPdfUpload from './AddLogoPdfUpload';
import AddLogoWorkspace from './AddLogoWorkspace';
import ToolHeading from '../../../components/tools/ToolHeading';

const STEPS = [
  { n: '1', title: 'Upload PDF', text: 'Add your label or document' },
  { n: '2', title: 'Upload logo', text: 'JPG, PNG, or WEBP image' },
  { n: '3', title: 'Download', text: 'Logo stamped on every page' },
];

export default function AddLogoPDF() {
  const {
    pdfFile,
    pageCount,
    isLoading,
    loadError,
    logoFile,
    logoPreviewUrl,
    sizeId,
    setSizeId,
    isProcessing,
    loadPdf,
    acceptPdf,
    loadLogo,
    acceptLogo,
    clearLogo,
    clearAll,
    clearPdfKeepLogo,
    runAddLogo,
  } = useAddLogo();

  return (
    <div className="cat-edit tool-page pb-20 pt-10 sm:pt-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center sm:mb-10">
            <ToolHeading toolId="add-logo" />
            <h1 className="mb-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Place your logo in the blank space
            </h1>
            <p className="mx-auto max-w-xl text-base text-ink-600 sm:text-lg">
              Upload a PDF, then your logo. We put it in the bottom white space on every page —
              ideal for Meesho labels, invoices, and packing slips.
            </p>
          </div>

          {!pdfFile ? (
            <>
              <AddLogoPdfUpload
                onFileChange={loadPdf}
                onFileDrop={acceptPdf}
                disabled={isProcessing}
              />

              <div className="mt-10 rounded-3xl border border-ink-200 bg-white px-6 py-6 sm:px-8">
                <h3 className="mb-5 text-center text-sm font-semibold text-ink-900 sm:text-left">
                  How it works
                </h3>
                <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {STEPS.map((step) => (
                    <li
                      key={step.n}
                      className="flex items-center gap-3 text-left sm:flex-col sm:items-start"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                        {step.n}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{step.title}</p>
                        <p className="mt-0.5 text-xs text-ink-500">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : !logoFile ? (
            <AddLogoImageUpload
              pdfName={pdfFile.name}
              pageCount={pageCount}
              isLoading={isLoading}
              onLogoChange={loadLogo}
              onLogoDrop={acceptLogo}
              onBack={clearPdfKeepLogo}
              disabled={isProcessing}
            />
          ) : (
            <AddLogoWorkspace
              pdfFile={pdfFile}
              pageCount={pageCount}
              isLoading={isLoading}
              loadError={loadError}
              logoFile={logoFile}
              logoPreviewUrl={logoPreviewUrl}
              sizeId={sizeId}
              setSizeId={setSizeId}
              isProcessing={isProcessing}
              onClearLogo={clearLogo}
              onClearAll={clearAll}
              onApply={runAddLogo}
            />
          )}

          <ToolSeoSection toolId="add-logo" />
        </div>
      </div>
    </div>
  );
}
