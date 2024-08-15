import React from 'react';
import { useParams } from 'react-router-dom';
import GoogleDrivePlayer from './VideoPlayer';
import QuestionsList from './QuestionsList';
import videoLessons from './videoLessons';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledVideoPlayer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  width: '100%',
  maxWidth: '800px',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  alignSelf: 'center',
}));

const VideoPage = ({ userId, progressRecordId }) => {
  const { id } = useParams();

  const selectedVideo = videoLessons.find((video) => video.id === parseInt(id));

  if (!selectedVideo) {
    return <div>Video not found</div>;
  }

  return (
    <StyledContainer>
      <Typography className="title" variant="h4" gutterBottom>
        {selectedVideo.title}
      </Typography>

      <StyledVideoPlayer>
        <GoogleDrivePlayer src={selectedVideo.srcu} />
      </StyledVideoPlayer>
      <StyledPaper elevation={3}>
        <QuestionsList 
          videoId={selectedVideo.id} 
          questions={selectedVideo.questions} 
          userId={userId} 
          progressRecordId={progressRecordId} 
        />
      </StyledPaper>
    </StyledContainer>
  );
};

export default VideoPage;
