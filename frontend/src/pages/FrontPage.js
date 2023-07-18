import React, {useState,useEffect} from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import CheckAuth from '../components/CheckAuth';


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

const FrontPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    
    <FrontPageContainer>
  <Title>Mini Football Croatia</Title>
  <Subtitle>
    Find the latest results of Croatian mini football leagues and tournaments{' '}
    {isLoggedIn === true && 'You are logged in.'}
  </Subtitle>

  <div style={{ display: 'flex', gap: '10px' }}>
    <Button variant="contained" component={Link} to="/tournaments">
      View Tournaments
    </Button>
    <CheckAuth>
      <Button variant="contained" color = "success" component={Link} to="/my-tournaments">
        My Tournaments
      </Button>
      <Button variant="contained" color = "secondary" component={Link} to="/create-tournament">
        Create tournament
      </Button>
    </CheckAuth>
  </div>
</FrontPageContainer>
  );
};

export default FrontPage;
