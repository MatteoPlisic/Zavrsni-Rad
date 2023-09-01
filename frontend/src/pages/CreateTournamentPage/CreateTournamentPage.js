import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Container, FormControl, FormLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import axios from 'axios';

const CreateTournamentPage = () => {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [format, setFormat] = useState('16');
  const [successMessage, setSuccessMessage] = useState('');
  const [teams, setTeams] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("/teams", { withCredentials: true });
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  const handleCheckboxChange = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  async function handleSubmit() {
    try {
      const currentDate = new Date();
      if (!name || !date || !location || !format) {
        setValidationMessage('All fields are required');
        setSuccessMessage('');
      } else if (selectedTeams.length.toString() !== format.toString()) {
        setValidationMessage('Number of selected teams has to be equal to the format');
        setSuccessMessage('');
      } else if (Date.parse(date) < currentDate) {
        setValidationMessage("Date needs to be equal or greater to today");
        setSuccessMessage('');
      } else {
        const response = await axios.post('/tournaments', { name, date, location, format, selectedTeams }, { withCredentials: true });
        if (response.status === 200) {
          setSuccessMessage('Tournament created successfully!');
          setValidationMessage('');
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
          width: '250px', // Set a fixed width of 500px
          border: '1px solid #ccc',
          borderRadius: '8px',
          background: '#fff',
          padding: '20px',
          height: 'fit-content',
          minHeight: '400px',
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
          <MenuItem value="8">8 teams</MenuItem>
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
                    checked={selectedTeams.includes(team._id)}
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
