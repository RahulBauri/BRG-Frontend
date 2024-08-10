import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit}>
      <input type='file' onChange={handleFileChange} />
      <button type='submit'>Upload Video</button>
    </form>
  );
};

export default App;
