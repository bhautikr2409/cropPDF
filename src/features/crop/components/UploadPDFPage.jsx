import { MAX_PDF_BYTES } from '../../../constants';

const UploadPDFPage = ({ onFileChange }) => {
  const maxMb = Math.round(MAX_PDF_BYTES / (1024 * 1024));

  return (
    <div className="bg-white rounded-xl shadow-lg p-10 text-center border border-slate-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3 text-slate-800">Upload PDF to Crop</h2>
        <p className="text-slate-600">
          Select a PDF file to start cropping. Files stay on your device (max {maxMb} MB).
        </p>
      </div>
      <label className="cursor-pointer inline-flex items-center justify-center px-8 py-4 border-2 border-dashed border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={onFileChange}
          className="hidden"
        />
        <span className="text-blue-600 font-medium">Choose PDF file</span>
      </label>
    </div>
  );
};

export default UploadPDFPage;
