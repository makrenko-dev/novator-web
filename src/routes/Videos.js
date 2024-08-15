import React from 'react';
import VideoGrid from '../components/Videos/VideoGrid.js';

const Videos = ({ userID }) => { // принять userID в качестве аргумента
  return (
    <div>
       <h1 style={{marginTop:'20px', marginLeft:'20px', marginBottom:'30px'}}>Уроки</h1>
       {console.log(userID)}
      <VideoGrid userId={userID} /> 
    </div>
  );
};

export default Videos;
