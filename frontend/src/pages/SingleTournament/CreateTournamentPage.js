import { Button, Container, FormControl, FormLabel, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import Cookies from 'js-cookie';

const CreateTournamentPage = () => {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit() {
    try {
      const response = await axios.post('/tournaments', { name, date, location }, { withCredentials: true });
      if (response.status === 200) {
        setSuccessMessage('Tournament created successfully!');
        // You can reset the form fields here if needed
        setName('');
        setDate('');
        setLocation('');
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      // Handle error cases if necessary
    }
  }

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '20px',
        marginTop:'5vh'
      }}
    >
      <FormControl
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          background: '#fff',
          padding: '20px',
        }}
      >
        <FormLabel>Name</FormLabel>
        <TextField
          color="warning"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormLabel>Date</FormLabel>
        <TextField
          color="warning"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <FormLabel>Location</FormLabel>
        <TextField
          color="warning"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <Button style={{ marginTop: '10px' }} variant="contained" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </FormControl>
    </Container>
  );
};

export default CreateTournamentPage;
