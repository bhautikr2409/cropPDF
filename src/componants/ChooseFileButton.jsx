import toast from 'react-hot-toast'; // Import toast
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ChooseButton() {
  const [fileName, setFileName] = React.useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]; // Get the first file if any
    if (file) {
      setFileName(file.name); // Update the file name state
      toast.success(`PDF "${file.name}" added successfully!`);
    }
    else{
      toast.error(`Please select a PDF file!`);
    }
  };

  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
    >
      {fileName || 'Upload files'}
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileChange}
        accept=".pdf" // Restrict to PDF files
        multiple={false} // Allow only single file upload
      />
    </Button>
  );
}
  