import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, FormControl, MenuItem, Select, TextField } from '@mui/material';

const EditTournamentPage = () => {
  const { id } = useParams(); // Get the tournament ID from the URL
  const [ validationMessage,setValidationMessage] = useState('')
  const [successMessage,setSuccessMessage] = useState('')
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [format, setFormat] = useState('4');
  const [selectedTeams,setSelectedTeams] = useState([])
  const [teams, setTeams] = useState([])

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        
        const tournament = await axios.get(`/tournaments/${id}`, { withCredentials: true });
        const getteams = tournament.data.teams
        console.log(tournament)
        setName(tournament.data.name)
        setDate(new Date(tournament.data.date).toISOString().split('T')[0])
        setLocation(tournament.data.location)
        setFormat(tournament.data.format.toString())
        setSelectedTeams(getteams);
      } catch (error) {
        console.error('Error fetching tournament:', error);
      }
    };

    fetchTournament();
  }, [id]);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();
  
      if (Date.parse(date) < currentDate) {
        setValidationMessage("Date needs to be equal or greater than today");
        setSuccessMessage('');
      } else {
        const response = await axios.put(`/tournaments/${id}`, { name, date, location, format, selectedTeams }, { withCredentials: true });
        console.log('Tournament updated:', response.data);
        setSuccessMessage('Tournament updated:');
        setValidationMessage('');
      }
    } catch (error) {
      console.error('Error updating tournament:', error);
      console.log(error);
  
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setValidationMessage("Invalid request. Please check your data.");
          setSuccessMessage('');
        } else if (status === 404) {
          setValidationMessage("Tournament not found.");
          setSuccessMessage('');
        } else if (status === 409) {
          setValidationMessage("A tournament with the updated name already exists.");
          setSuccessMessage('');
        } else {
          setValidationMessage("An error occurred while updating the tournament.");
          setSuccessMessage('');
        }
      } else {
        setValidationMessage("An error occurred while updating the tournament.");
        setSuccessMessage('');
      }
    }
  };
  

  return (
    <Container maxWidth="sm">
      <h2>Edit Tournament</h2>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
        <Select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          color="warning"
        >
          <MenuItem value="16">16 teams</MenuItem>
          <MenuItem value="32">32 teams</MenuItem>
          <MenuItem value="4">4 teams</MenuItem>
        </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {validationMessage && <p style={{ color: 'red' }}>{validationMessage}</p>}
      </form>
    </Container>
  );
};

export default EditTournamentPage;
