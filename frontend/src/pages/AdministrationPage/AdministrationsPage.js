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

  async function fetchPlayers() {
    try {
      const response = await axios.get("/players", { withCredentials: true });
      setPlayers(response.data);

      // Fetch the team names for each player and store them in playerTeams state
      const playerTeamPromises = response.data.map(async (player) => {
        if (player.team) {
          const teamName = await findTeamName(player.team);
          return { playerId: player._id, teamName };
        } else {
          return { playerId: player._id, teamName: "No Team" };
        }
      });

      // Wait for all team name promises to resolve
      const playerTeamData = await Promise.all(playerTeamPromises);

      // Convert the array of player teams into an object for easier lookup
      const playerTeamObject = playerTeamData.reduce((acc, { playerId, teamName }) => {
        acc[playerId] = teamName;
        return acc;
      }, {});

      setPlayerTeams(playerTeamObject);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  }

  async function fetchTeams() {
    try {
      const response = await axios.get("/teams", { withCredentials: true });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }

  const handleCreateTeam = async () => {
    try {
     const res=    await axios.post('/teams', { name: teamName });
     console.log(res)
     setTeamName('');
      fetchTeams(); // Refresh the team list after creating a new team
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await axios.delete(`/teams/${teamId}`, { withCredentials: true });
      fetchTeams(); // Refresh the team list after deleting a team
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await axios.delete(`/players/${playerId}`, { withCredentials: true });
      fetchPlayers(); // Refresh the player list after deleting a player
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  const handleCreatePlayer = async () => {
    try {
      await axios.post('/players', {
        name: playerName,
        dateOfBirth: playerDateOfBirth,
        team: selectedTeam, // Include the selected team ID in the player data
      });
      
      setPlayerName('');
      setPlayerDateOfBirth('');
      setSelectedTeam(''); // Reset the selected team after creating the player
      fetchPlayers(); // Refresh the player list after creating a new player
    } catch (error) {
      console.error('Error creating player:', error);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  async function findTeamName(id) {
    try {
      const response = await axios.get(`/teams/${id}`);
      return response.data.name;
    } catch (error) {
      console.error('Error fetching team:', error);
      return 'Unknown Team';
    }
  }

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
          margin="dense"
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
      <Box p={3} marginTop={"50px"}>
        <Box mt={3}>
          <Typography variant="h5">Create a New Player</Typography>
          <TextField
            label="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
          />
          <TextField
            value={playerDateOfBirth}
            onChange={(e) => setPlayerDateOfBirth(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
            type="date"
            placeholder=""
          />
          <Select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            margin="dense"
          >
            <MenuItem value="">None</MenuItem>
            {teams.map((team) => (
              <MenuItem key={team._id} value={team._id}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" color="primary" onClick={handleCreatePlayer}>
            Create Player
          </Button>
        </Box>

        {/* Box for displaying players */}
        <Box mt={3}>
          <Typography variant="h5">All Players</Typography>
          <List>
            {players.map((player) => (
              <ListItem key={player._id}>
                <ListItemText
                  primary={player.name}
                  secondary={`Age: ${calculateAge(player.dateOfBirth)}`}
                />
                {/* Display the team name of the player */}
                
                <ListItemSecondaryAction>
                  <Button component={Link} to={`/edit-player/${player._id}`} edge="end" aria-label="edit">
                    Edit
                  </Button>
                  <Button onClick={() => handleDeletePlayer(player._id)} edge="end" aria-label="delete">
                    Delete
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default AdministrationPage;