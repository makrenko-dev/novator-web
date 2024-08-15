import React from 'react';

const VideoPlayer = ({ src }) => {
  return (
    <div>
      <video controls width="600">
        <source src={src} type="video/mp4" />
        Ваш браузер не поддерживает видео
      </video>
    </div>
  );
};

export default VideoPlayer;
