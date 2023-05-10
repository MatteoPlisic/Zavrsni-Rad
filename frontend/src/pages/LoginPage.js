import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
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
 
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { email, password },{withCredentials:true});
      const token = res.data.token;
      const cookieOptions = {
        expires: 30, 
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      };

      Cookies.set('Authorization', token, );
      console.log(token);

     navigate('/')
     // 
    } catch (err) {
      console.error(err);
    }
   
  }
  
  
  

  return (
    <LoginPageContainer>
      <LoginFormContainer>
        <Title>Login</Title>
        <TextField
          label="Email"
          variant="outlined"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <LoginButton variant="contained" onClick={handleLogin}>
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
