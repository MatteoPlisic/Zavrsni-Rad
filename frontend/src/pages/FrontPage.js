import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const FrontPageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 64px)',
});

const Title = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '48px',
  marginBottom: '24px',
});

const Subtitle = styled(Typography)({
  fontSize: '24px',
  marginBottom: '48px',
  textAlign: 'center',
});

const CtaButton = styled(Button)({
  marginTop: '24px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2d3ebf',
  },
});

const FrontPage = () => {
  return (
    <FrontPageContainer>
      <Title>Mini Football Croatia</Title>
      <Subtitle>Find the latest results of Croatian mini football leagues and tournaments</Subtitle>
      <CtaButton variant="contained" component={Link} to="/leagues">
        View Leagues
      </CtaButton>
    </FrontPageContainer>
  );
};

export default FrontPage;
