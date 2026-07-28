import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';
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
 * Remove password protection from a PDF and download the unlocked file.
 */
export async function unlockAndDownload(file, password) {
  if (!password || password.length < 1) {
    toast.error('Enter the PDF password to unlock it.');
    return false;
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const info = await isEncrypted(bytes);

    if (!info.encrypted) {
      toast.error('This PDF is not password-protected.');
      return false;
    }

    const decrypted = await decryptPDF(bytes, password);
    const blob = new Blob([decrypted], { type: 'application/pdf' });
    const name = file.name.replace(/\.pdf$/i, '') || 'document';
    triggerDownload(blob, `${name}-unlocked.pdf`);
    toast.success('PDF unlocked and downloaded.');
    return true;
  } catch (error) {
    console.error('Unlock PDF error:', error);
    const message = String(error?.message || error);
    if (/incorrect password/i.test(message)) {
      toast.error('Incorrect password. Please try again.');
    } else if (/not encrypted/i.test(message)) {
      toast.error('This PDF is not password-protected.');
    } else if (/unsupported encryption/i.test(message)) {
      toast.error('This encryption type is not supported.');
    } else if (/secure context|subtle/i.test(message)) {
      toast.error('AES decryption needs HTTPS or localhost.');
    } else {
      toast.error('Failed to unlock PDF.');
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
