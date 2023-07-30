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
  IconButton,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const AdministrationPage = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    
    fetchTeams();
  }, []);

  async function fetchTeams  ()  {
    try {
      const response = await axios.get("/teams", { withCredentials: true });
      console.log(response)
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleCreateTeam = async () => {
    try {
      await axios.post('/teams', { name: teamName });
      setTeamName('');
      fetchTeams(); // Refresh the team list after creating a new team
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await axios.delete(`/teams/${teamId}`);
      fetchTeams(); // Refresh the team list after deleting a team
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

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
        <Button variant="contained" color="primary" onClick={handleCreateTeam}>
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
                  onClick={() => handleDeleteTeam(team._id)}
                  
                >
                  Delete
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default AdministrationPage;
