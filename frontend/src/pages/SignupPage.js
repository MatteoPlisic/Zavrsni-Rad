import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post('/signup', formData)
      .then((response) => {
        console.log(response.data); // handle successful response
      })
      .catch((error) => {
        console.error(error); // handle error
      });
  };

  return (
    <SignupPageContainer>
      <SignupFormContainer>
        <Title>Sign up</Title>
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
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
