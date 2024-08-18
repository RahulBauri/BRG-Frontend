import React, { useRef, useEffect, useState } from 'react';
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
        style={{ width: '100%', maxHeight:"10vh", height: 'auto', display:"inline-block" }}
        preload="metadata"
      />
      <p 
        style={{ width: '100%', maxHeight:"10vh", height: 'auto', display:"inline-block" }}
        >{video.name}</p>
      {isSelected && <div className="tick-radio"></div>}
    </div>
  );
};

const VideoPreviewPanel = ({ videos, selectedVideo, onSelectVideo }) => {

  const [useSingle, setUseSingle] = useState(false);

  const handleRadioChange = () => {
    setUseSingle(!useSingle);
  };

  return (
    <div className="video-preview-panel">
      <label className="radio-checkbox">
      <input
        type="radio"
        checked={useSingle}
        onChange={handleRadioChange}
        className="radio-checkbox-input"
      />
      <span className="radio-checkbox-custom" />
      Select Random
    </label>
      <h3>Available Videos</h3>
      <button type='radio' />
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