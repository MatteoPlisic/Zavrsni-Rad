import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Select, MenuItem } from '@mui/material';

const EditPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate('')
  const [player, setPlayer] = useState({});
  const [playerName, setPlayerName] = useState('');
  const [playerDateOfBirth, setPlayerDateOfBirth] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams,setTeams] = useState([])

  useEffect(() => {
    fetchPlayer();
  }, []);

  const fetchPlayer = async () => {
    try {
      const response = await axios.get(`/players/${id}`);
      setPlayer(response.data);
      setPlayerName(response.data.name);
      setPlayerDateOfBirth(new Date(response.data.dateOfBirth).toISOString().split('T')[0]);
      setSelectedTeam(response.data.team); // Set the selected team ID

      const res = await axios.get("/teams",{withCredentials:true})
      setTeams(res.data)
    } catch (error) {
      console.error('Error fetching player:', error);
    }
  };

  const handleUpdatePlayer = async () => {
    try {
      await axios.put(`/players/${id}`, {
        name: playerName,
        dateOfBirth: playerDateOfBirth,
        team: selectedTeam, // Include the selected team ID in the player data
      });
      navigate('/administration'); // Redirect to the administration page after updating player
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  return (
    <Box p={3} marginTop={"50px"}>
      <Typography variant="h4" gutterBottom>
        Edit Player
      </Typography>

      <Box mt={3}>
        <Typography variant="h5">Player Name</Typography>
        <TextField
          label="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
        />
      </Box>

      <Box mt={3}>
        <Typography variant="h5">Date of Birth</Typography>
        <TextField
          label="Date of Birth"
          type="date"
          value={playerDateOfBirth}
          onChange={(e) => setPlayerDateOfBirth(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      {/* Dropdown menu for selecting the team */}
      <Box mt={3}>
        <Typography variant="h5">Select Team</Typography>
        <Select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
        >
          <MenuItem value="">None</MenuItem>
          {/* Assuming you have a teams array with available teams */}
          {teams.map((team) => (
            <MenuItem key={team._id} value={team._id}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleUpdatePlayer}>
          Update Player
        </Button>
      </Box>
    </Box>
  );
};

export default EditPlayerPage;
