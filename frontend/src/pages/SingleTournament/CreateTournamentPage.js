import { Button, Checkbox, Container, FormControl, FormLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CreateTournamentPage = () => {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [format, setFormat] = useState('16'); // Default format is set to 16 teams
  const [successMessage, setSuccessMessage] = useState('');
  const [teams, setTeams] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("/teams", { withCredentials: true });
        console.log(response)
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

 const handleCheckboxChange = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      // If the team ID exists in the selectedTeams array, remove it
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
    } else {
      // If the team ID does not exist in the selectedTeams array, add it
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };


  async function handleSubmit() {
    try {
      const currentDate = new Date();
      if (teams.length.toString() !== format.toString()) {
        console.log(teams.length)
        setValidationMessage('You need to pick the same number of teams as the format you chose');
        setSuccessMessage('')
      }
      else if (Date.parse(date) < currentDate){
        setValidationMessage("Date needs to be equal or greater to today")
        setSuccessMessage('')
      } else {
        
        const response = await axios.post('/tournaments', { name, date, location, format, selectedTeams }, { withCredentials: true });
        if (response.status === 200) {
          setSuccessMessage('Tournament created successfully!');
    
          setName('');
          setDate('');
          setLocation('');
          setFormat('16');
          
          setSelectedTeams([]);
        }
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      
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
        marginTop: '5vh'
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
        <FormLabel>Format</FormLabel>
        <Select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          color="warning"
        >
          <MenuItem value="16">16 teams</MenuItem>
          <MenuItem value="32">32 teams</MenuItem>
          <MenuItem value="4">4 teams</MenuItem>
        </Select>

        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {validationMessage && <p style={{ color: 'red' }}>{validationMessage}</p>}
        <Button style={{ marginTop: '10px' }} variant="contained" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </FormControl>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Selected</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team._id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>
                <Checkbox
                // Check if the team is in the selectedTeams array
                checked={selectedTeams.includes(team._id)}
                // Handle checkbox state change
                onChange={() => handleCheckboxChange(team._id)}
              />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Container>

  );
};

export default CreateTournamentPage;
