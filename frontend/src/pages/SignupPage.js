import React from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

const SignupPageContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 64px)',
});

const SignupFormContainer = styled(Box)({
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

const SignupButton = styled(Button)({
  marginTop: '24px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2d3ebf',
  },
});

const SignupPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission
  };

  return (
    <SignupPageContainer>
      <SignupFormContainer>
        <Title>Sign up</Title>
        <TextField label="Name" variant="outlined" required />
        <TextField label="Email" variant="outlined" type="email" required />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
        />
        <SignupButton variant="contained" onClick={handleSubmit}>
          Sign up
        </SignupButton>
        <Typography variant="body2" align="center">
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </SignupFormContainer>
    </SignupPageContainer>
  );
};

export default SignupPage;
