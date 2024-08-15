import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'video/*',
    multiple: false
  });

  return (
    <div {...getRootProps()} className={`file-upload ${isDragActive ? 'dragging' : ''}`}>
      <input {...getInputProps()} />
      <p>Drag & drop a video file here, or click to select one</p>
      {isDragActive ? (
        <div>Drop the file here ...</div>
      ) : (
        <div>Drag 'n' drop a video file here, or click to select one</div>
      )}
    </div>
  );
};

export default FileUpload;