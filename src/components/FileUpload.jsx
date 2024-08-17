import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import uploadIcon from "../assets/cloud-upload.svg" 

const FileUpload = ({ onFileUpload }) => {
  const [uploaded,setUploaded] = useState(null)
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploaded(URL.createObjectURL(acceptedFiles[0]))
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
      {uploaded ? <>
        <video src={uploaded} style={{height: "100%"}}></video>
        </>: <>
      <input {...getInputProps()} />
      <img src={uploadIcon} height={100} width={100}/>
      <p>Drag & drop a video file here</p>
      OR click to select one
      </>}
    </div>
  );
};

export default FileUpload;