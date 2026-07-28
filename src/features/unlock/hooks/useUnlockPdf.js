import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { validatePdfFile } from '../../crop/utils/validatePdfFile';
import { checkPdfEncryption, unlockAndDownload } from '../utils/unlockPdf';

export function useUnlockPdf() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [encryptionInfo, setEncryptionInfo] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      if (!info.encrypted) {
        setLoadError('This PDF is not password-protected.');
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
  }, []);

  const acceptFile = useCallback((selected) => {
    if (!validatePdfFile(selected)) return;
    setFile(selected);
    setPassword('');
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setEncryptionInfo(null);
    setLoadError(null);
    setPassword('');
  }, []);

  const runUnlock = useCallback(async () => {
    if (!file) {
      toast.error('Upload a PDF first.');
      return;
    }
    if (!password) {
      toast.error('Enter the password.');
      return;
    }

    setIsProcessing(true);
    try {
      await unlockAndDownload(file, password);
    } finally {
      setIsProcessing(false);
    }
  }, [file, password]);

  return {
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
  };
}
