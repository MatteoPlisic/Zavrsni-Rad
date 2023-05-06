import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

const LoginPageContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 64px)',
});

const LoginFormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '48px',
  borderRadius: '8px',
  boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  width: '100%',
});

const Title = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '32px',
  marginBottom: '24px',
});

const LoginButton = styled(Button)({
  marginTop: '24px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2d3ebf',
  },
});

const LoginPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission
  };

  return (
    <LoginPageContainer>
      <LoginFormContainer>
        <Title>Login</Title>
        <TextField label="Email" variant="outlined" required />
        <TextField label="Password" variant="outlined" type="password" required />
        <LoginButton variant="contained" onClick={handleSubmit}>
          Login
        </LoginButton>
        <Typography variant="body2" align="center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </LoginFormContainer>
    </LoginPageContainer>
  );
};

export default LoginPage;
