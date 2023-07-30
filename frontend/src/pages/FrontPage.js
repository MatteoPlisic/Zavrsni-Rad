import MenuIcon from '@mui/material/Menu';
import { AppBar,Button, Toolbar, IconButton, List, ListItem, ListItemText, Drawer, Divider,Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CheckAuth from '../components/CheckAuth';

const FrontPageContainer = styled('div')({
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <>
   

      <FrontPageContainer>
        <Title>Mini Football Croatia</Title>
        <Subtitle>
          Find the latest results of Croatian mini football leagues and tournaments{' '}
          {isLoggedIn === true && 'You are logged in.'}
        </Subtitle>

       
      </FrontPageContainer>
    </>
  );
};

export default FrontPage;
