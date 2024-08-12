import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileList from './components/FileList';
import './App.css';

const App = () => {
  const [files, setFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      dateUploaded: new Date().toLocaleDateString(),
      lastUpdated: 'Just now'
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Set the first dropped file as the video file for upload
    if (acceptedFiles.length > 0) {
      setVideoFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: 'video/*'
  });

  useEffect(() => {
    if (videoFile) {
      const objectUrl = URL.createObjectURL(videoFile);
      setVideoPreview(objectUrl);

      // Free memory when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [videoFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      console.error('No video file selected');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/video/processSingleVideo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Video uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Dashboard usedStorage={13.25} totalStorage={15} />
        <div {...getRootProps()} className={`file-upload ${isDragActive ? 'dragging' : ''}`}>
          <input {...getInputProps()} />
          {videoPreview ? (
            <div className="video-preview">
              <video src={videoPreview} controls style={{ maxWidth: '100%', maxHeight: '200px' }} />
              <p>{videoFile.name}</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">↑</div>
              <p>Upload your file</p>
              <div>Drag and drop your files here or <span>choose files</span></div>
            </>
          )}
        </div>
        <form onSubmit={handleSubmit} className="upload-form">
          <button 
            type="submit" 
            className={`upload-button ${!videoFile ? 'disabled' : ''}`}
            disabled={!videoFile}
          >
            Upload Video
          </button>
        </form>
        <FileList files={files} />
      </main>
    </div>
  );
};

export default App;