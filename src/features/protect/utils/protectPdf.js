import { encryptPDF, AlreadyEncryptedError } from '@pdfsmaller/pdf-encrypt';
import { isEncrypted } from '@pdfsmaller/pdf-decrypt';
import toast from 'react-hot-toast';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Password-protect a PDF with AES-256 encryption and download it.
 */
export async function protectAndDownload(file, password, options = {}) {
  const {
    ownerPassword,
    allowPrinting = true,
    allowCopying = true,
    allowModifying = false,
  } = options;

  if (!password || password.length < 1) {
    toast.error('Enter a password to protect this PDF.');
    return false;
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const info = await isEncrypted(bytes);

    if (info.encrypted) {
      toast.error('This PDF is already password-protected. Unlock it first.');
      return false;
    }

    const encrypted = await encryptPDF(bytes, password, {
      ownerPassword: ownerPassword || password,
      algorithm: 'AES-256',
      allowPrinting,
      allowCopying,
      allowModifying,
      allowAnnotating: allowModifying,
      allowFillingForms: true,
      allowExtraction: true,
      allowAssembly: allowModifying,
      allowHighQualityPrint: allowPrinting,
    });

    const blob = new Blob([encrypted], { type: 'application/pdf' });
    const name = file.name.replace(/\.pdf$/i, '') || 'document';
    triggerDownload(blob, `${name}-protected.pdf`);
    toast.success('PDF protected and downloaded.');
    return true;
  } catch (error) {
    console.error('Protect PDF error:', error);
    if (error instanceof AlreadyEncryptedError || /already encrypted/i.test(String(error?.message))) {
      toast.error('This PDF is already password-protected.');
    } else if (/secure context|subtle/i.test(String(error?.message || error))) {
      toast.error('AES encryption needs HTTPS or localhost.');
    } else {
      toast.error('Failed to protect PDF. The file may be damaged.');
    }
    return false;
  }
}

export async function checkPdfEncryption(file) {
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return await isEncrypted(bytes);
  } catch {
    return { encrypted: false };
  }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
