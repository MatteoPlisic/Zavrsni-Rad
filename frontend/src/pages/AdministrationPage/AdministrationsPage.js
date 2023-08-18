import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  Select,
} from '@mui/material';

const AdministrationPage = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerDateOfBirth, setPlayerDateOfBirth] = useState('');
  const [playerTeams, setPlayerTeams] = useState({}); // State to store player teams

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  // Fetch players and their teams
  async function fetchPlayers() {
    try {
      const response = await axios.get("/players", { withCredentials: true });
      setPlayers(response.data);

      // ... (rest of the fetchPlayers logic)
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  }

  // Fetch teams
  async function fetchTeams() {
    try {
      const response = await axios.get("/teams", { withCredentials: true });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }

  // Create a team
  const createTeam = async (name) => {
    try {
      const res = await axios.post('/teams', { name },{withCredentials:true});
      console.log(res);
      console.log("Team created");
      setTeamName('');
      fetchTeams(); // Refresh the team list after creating a new team
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  // Delete a team
  const deleteTeam = async (teamId) => {
    try {
      await axios.delete(`/teams/${teamId}`, { withCredentials: true });
      fetchTeams(); // Refresh the team list after deleting a team
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  // ... (other functions)

  return (
    <Box p={3} marginTop={"50px"}>
      <Typography variant="h4" gutterBottom>
        Administration Page
      </Typography>

      {/* Form to create a new team */}
      <Box mt={3}>
        <Typography variant="h5">Create a New Team</Typography>
        <TextField
          label="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={() => createTeam(teamName)}>
          Create Team
        </Button>
      </Box>

      {/* List of all teams with options to edit or delete */}
      <Box mt={3}>
        <Typography variant="h5">All Teams</Typography>
        <List>
          {teams.map((team) => (
            <ListItem key={team._id}>
              <ListItemText primary={team.name} />
              <ListItemSecondaryAction>
                <Button
                  component={Link}
                  to={`/edit-team/${team._id}`}
                  edge="end"
                  aria-label="edit"
                >
                  Edit
                </Button>
                <Button
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteTeam(team._id)}
                >
                  Delete
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* ... (rest of the component) */}
    </Box>
  );
};

export default AdministrationPage;
