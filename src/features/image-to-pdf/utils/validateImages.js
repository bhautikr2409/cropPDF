import toast from 'react-hot-toast';
import { MAX_IMAGE_BYTES, MAX_IMAGE_FILES } from '../../../constants';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

function isImageFile(file) {
  if (IMAGE_TYPES.has(file.type)) return true;
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}

/**
 * Validate images for Image → PDF conversion.
 * @returns {File[]}
 */
export function validateImageFiles(incomingFiles, existingFiles = []) {
  const incoming = Array.from(incomingFiles || []);
  if (incoming.length === 0) {
    toast.error('Please select at least one image.');
    return [];
  }

  const accepted = [];
  for (const file of incoming) {
    if (!isImageFile(file)) {
      toast.error(`"${file.name}" is not a supported image (JPG, PNG, WEBP).`);
      continue;
    }
    if (file.size === 0) {
      toast.error(`"${file.name}" appears to be empty.`);
      continue;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(`"${file.name}" must be under 15 MB.`);
      continue;
    }
    if (existingFiles.length + accepted.length >= MAX_IMAGE_FILES) {
      toast.error(`You can add up to ${MAX_IMAGE_FILES} images.`);
      break;
    }

    const duplicate = [...existingFiles, ...accepted].some(
      (item) => item.file.name === file.name && item.file.size === file.size
    );
    if (duplicate) {
      toast.error(`"${file.name}" is already in the list.`);
      continue;
    }

    accepted.push(file);
  }

  return accepted;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
