import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { checkPdfEncryption, protectAndDownload } from '../utils/protectPdf';

export function useProtectPdf() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [encryptionInfo, setEncryptionInfo] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [allowModifying, setAllowModifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!file) {
      setEncryptionInfo(null);
      setLoadError(null);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    checkPdfEncryption(file).then((info) => {
      if (cancelled) return;
      setIsLoading(false);
      setEncryptionInfo(info);
      if (info.encrypted) {
        setLoadError('This PDF is already password-protected. Unlock it before re-protecting.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  const loadFile = useCallback((event) => {
    const selected = event?.target?.files?.[0];
    if (!validatePdfFile(selected)) {
      if (event?.target) event.target.value = '';
      return;
    }
    setFile(selected);
    setPassword('');
    setConfirmPassword('');
  }, []);

  const acceptFile = useCallback((selected) => {
    if (!validatePdfFile(selected)) return;
    setFile(selected);
    setPassword('');
    setConfirmPassword('');
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setEncryptionInfo(null);
    setLoadError(null);
    setPassword('');
    setConfirmPassword('');
  }, []);

  const runProtect = useCallback(async () => {
    if (!file) {
      toast.error('Upload a PDF first.');
      return;
    }
    if (!password) {
      toast.error('Enter a password.');
      return;
    }
    if (password.length < 4) {
      toast.error('Use at least 4 characters for the password.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsProcessing(true);
    try {
      await protectAndDownload(file, password, {
        allowPrinting,
        allowCopying,
        allowModifying,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [allowCopying, allowModifying, allowPrinting, confirmPassword, file, password]);

  return {
    file,
    isLoading,
    loadError,
    encryptionInfo,
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
  };
}
