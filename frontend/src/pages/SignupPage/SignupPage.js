import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checker() {
      const res = await axios.get('/check-auth', { withCredentials: true });

      if (res.status === 200) navigate('/');
    }

    checker();
  }, []);

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

    // Validation logic
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Invalid email address');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    axios
      .post('/signup', formData)
      .then((response) => {
        console.log(response.data);
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
        setError('Email already in use');
      });
  };

  return (
    <SignupPageContainer style={{height:"300px"}}>
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
        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        )}
        <Typography variant="body2" align="center">
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </SignupFormContainer>
    </SignupPageContainer>
  );
};

export default SignupPage;
