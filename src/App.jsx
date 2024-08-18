import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileList from './components/FileList';
import './App.css';
import VideoEditor from './components/VideoEditor';

const App = () => {
  const [files, setFiles] = useState([]);
  const [videoFile1, setVideoFile1] = useState(null);
  const [videoPreview1, setVideoPreview1] = useState(null);
  const [videoPreview2, setVideoPreview2] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [selectedVideo2, setSelectedVideo2] = useState('');
  const [captionPosition, setCaptionPosition] = useState({ x: 540, y: 960 });
  const canvasRef = useRef(null);

  // Fetch video list from backend
  useEffect(() => {
    const fetchVideoList = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/video/list');
        setVideoList(response.data);
      } catch (error) {
        console.error('Error fetching video list:', error);
      }
    };

    fetchVideoList();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      dateUploaded: new Date().toLocaleDateString(),
      lastUpdated: 'Just now'
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);

    if (acceptedFiles.length > 0) {
      setVideoFile1(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'video/*'
  });

  useEffect(() => {
    if (videoFile1) {
      const objectUrl1 = URL.createObjectURL(videoFile1);
      setVideoPreview1(objectUrl1);

      return () => URL.revokeObjectURL(objectUrl1);
    }
  }, [videoFile1]);

  // Load selected video2 for preview
  useEffect(() => {
    if (selectedVideo2) {
      const loadVideo2 = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/v1/video/preview/${selectedVideo2}`, {
            responseType: 'blob'
          });
          const objectUrl2 = URL.createObjectURL(response.data);
          setVideoPreview2(objectUrl2);

          return () => URL.revokeObjectURL(objectUrl2);
        } catch (error) {
          console.error('Error loading video 2:', error);
        }
      };

      loadVideo2();
    }
  }, [selectedVideo2]);

  const handleCanvasDraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 1080, 1920);

    drawCaption(ctx);
  };

  const drawCaption = (ctx) => {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'yellow';
    ctx.fillText('Sample Caption', captionPosition.x, captionPosition.y);
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    if (isPointInCaption(offsetX, offsetY)) {
      canvas.addEventListener('mousemove', handleCanvasMouseMove);
      canvas.addEventListener('mouseup', handleCanvasMouseUp);
    }
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setCaptionPosition({ x: offsetX, y: offsetY });

    handleCanvasDraw();
  };

  const handleCanvasMouseUp = () => {
    const canvas = canvasRef.current;
    canvas.removeEventListener('mousemove', handleCanvasMouseMove);
    canvas.removeEventListener('mouseup', handleCanvasMouseUp);
  };

  const isPointInCaption = (x, y) => {
    const captionWidth = 100; // Approximate width of the caption text
    const captionHeight = 30; // Approximate height of the caption text
    return (
      x >= captionPosition.x &&
      x <= captionPosition.x + captionWidth &&
      y >= captionPosition.y - captionHeight &&
      y <= captionPosition.y
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile1 || !selectedVideo2) {
      console.error('Both videos must be selected');
      return;
    }

    const formData = new FormData();
    formData.append('video1', videoFile1);
    formData.append('video2', selectedVideo2);
    formData.append('captionX', captionPosition.x);
    formData.append('captionY', captionPosition.y);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/video/processMergedVideo',
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
      {/* <Sidebar /> */}
      <main className="main-content">
        <Dashboard usedStorage={13.25} totalStorage={15} />
        <VideoEditor />
        {/* <FileList files={files} /> */}
      </main>
    </div>
  );
};

export default App;