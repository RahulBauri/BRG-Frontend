import React, { useRef, useEffect } from 'react';
import './VideoPreviewPanel.css'

const VideoThumbnail = ({ video, isSelected, onClick }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
        console.log(video)
      videoRef.current.currentTime = 1; // Set to 1 second to avoid black frames
    }
  }, [video]);

  return (
    <div 
      className={`video-tile ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <video 
        ref={videoRef}
        src={`http://localhost:3000/api/v1/video/preview/${video.name}`}
        style={{ width: '100%', height: 'auto' }}
        preload="metadata"
      />
      <p>{video.name}</p>
      {isSelected && <div className="tick-radio"></div>}
    </div>
  );
};

const VideoPreviewPanel = ({ videos, selectedVideo, onSelectVideo }) => {
  return (
    <div className="video-preview-panel">
      <h3>Available Videos</h3>
      <div className="video-grid">
        {videos.map((video) => (
          <VideoThumbnail
            key={video}
            video={video}
            isSelected={selectedVideo === video}
            onClick={() => onSelectVideo(video)}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoPreviewPanel;