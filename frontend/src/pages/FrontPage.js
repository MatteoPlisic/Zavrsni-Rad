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

const CtaButton = styled(Button)({
  marginTop: '24px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2d3ebf',
  },
});

const FrontPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
   
    const checkAuth = async () => {
      //console.log(Cookies.get('Authorization'))
      try {
        const response = await axios.get('/check-auth', {
          withCredentials: true,
          headers: {
            Cookie: `Authorization=${Cookies.get('Authorization')}`
          }
        });
        console.log(response)
        setIsLoggedIn(true);
      } catch (error) {
        
        console.error('Error checking auth:', error);
      }
    };
    checkAuth();
  }, []);

  return (
    
    <FrontPageContainer>
      <Title>Mini Football Croatia</Title>
      <Subtitle>Find the latest results of Croatian mini football leagues and tournaments
      {isLoggedIn === true  && 'You are logged in.'}
      </Subtitle>
      <CtaButton variant="contained" component={Link} to="/tournaments">
        View Tournaments
      </CtaButton>
      
    </FrontPageContainer>
  );
};

export default FrontPage;
