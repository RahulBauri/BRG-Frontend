import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';
import VideoPreviewPanel from './VideoPreviewPanel';

const VideoEditor = () => {
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [backendVideos, setBackendVideos] = useState([]);
  const [selectedBackendVideo, setSelectedBackendVideo] = useState('');
  const [captionPosition, setCaptionPosition] = useState({ x: 180, y: 320 });
  const containerRef = useRef(null);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  useEffect(() => {
    const fetchBackendVideos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/video/list');
        if (Array.isArray(response.data)) {
          setBackendVideos(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching backend videos:', error);
      }
    };

    fetchBackendVideos();
  }, []);

  useEffect(() => {
    console.log(selectedBackendVideo)
  },[selectedBackendVideo])

  const handleUpload = (file) => {
    setUploadedVideo(URL.createObjectURL(file));
  };

  const handleBackendVideoSelect = (videoName) => {
    setSelectedBackendVideo(videoName);
  };

  const handlePreview = () => {
    if (video1Ref.current) video1Ref.current.play();
    if (video2Ref.current) video2Ref.current.play();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let file = await fetch(uploadedVideo).then(r => r.blob());
    if (!file) {
      console.error('No video file selected');
      return;
    }

    const formData = new FormData();
    console.log(file,selectedBackendVideo)
    formData.append('video', file);

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

  const handleGenerate = async () => {
    const data = {
      video1: {
        file: uploadedVideo,
        start: video1Time.start,
        end: video1Time.end,
        position: video1Position
      },
      video2: {
        file: selectedBackendVideo,
        start: video2Time.start,
        end: video2Time.end,
        position: video2Position
      }
    };
  
    try {
      const response = await axios.post('http://localhost:3000/api/v1/video/processSingleVideo', data);
      console.log('Video generated:', response.data);
      // Handle success (e.g., show download link)
    } catch (error) {
      console.error('Error generating video:', error);
      // Handle error
    }
  };

  // const selectedVideoData = backendVideos.find(video => video.name === selectedBackendVideo);

  return (
    <div className="video-editor">
      <h2>Video Editor</h2>

      <div className="panels-container">
        <FileUpload onFileUpload={handleUpload} />
        
        <VideoPreviewPanel 
          videos={backendVideos} 
          selectedVideo={selectedBackendVideo} 
          onSelectVideo={handleBackendVideoSelect} 
        />

        <div className="preview-panel">
          <div ref={containerRef} className="video-container">
            <video 
              ref={video1Ref}
              src={uploadedVideo}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', objectFit: 'cover' }}
            />
            <video 
              ref={video2Ref}
              src={selectedBackendVideo ? selectedBackendVideo.thumbnail : ''}
              style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '50%', objectFit: 'cover' }}
            />
            <div className="caption" style={{ 
              position: 'absolute', 
              top: `${captionPosition.y}px`, 
              left: `${captionPosition.x}px`, 
              transform: 'translate(-50%, -50%)',
            }}>
              Sample Caption
            </div>
          </div>
          <button onClick={handlePreview} className="preview-button">Preview</button>
          <button onClick={handleSubmit} className="preview-button">GENERATE</button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;