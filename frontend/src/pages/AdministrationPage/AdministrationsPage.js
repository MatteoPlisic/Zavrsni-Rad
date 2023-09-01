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
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const AdministrationPage = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerDateOfBirth, setPlayerDateOfBirth] = useState('');
  const [playerTeams, setPlayerTeams] = useState({}); // State to store player teams
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [teamCreationSuccess, setTeamCreationSuccess] = useState('');
  const [teamNameError, setTeamNameError] = useState('');
  const [playerCreationSuccess, setPlayerCreationSuccess] = useState('');
  const [playerCreationError, setPlayerCreationError] = useState('');
  const [userCreationSuccess, setUserCreationSuccess] = useState('');
  const [userCreationError, setUserCreationError] = useState('');

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
    fetchUsers();
  },[]);

  const handleCreateUser = async () => {
    // Check if any field is left blank
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setUserCreationError('All fields are required');
      return; // Exit the function to prevent creating the user
    }
  
    // Check if the email is in a valid format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(newUserEmail)) {
      setUserCreationError('Invalid email format');
      return; // Exit the function to prevent creating the user
    }
  
    // Check if the password is at least 8 characters long
    if (newUserPassword.length < 8) {
      setUserCreationError('Password must be at least 8 characters long');
      return; // Exit the function to prevent creating the user
    }
  
    try {
      await axios.post('/users', {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        isSuperUser: isSuperUser,
      }, { withCredentials: true });
  
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setIsSuperUser(false);
      setUserCreationError(''); // Clear the error message
      setUserCreationSuccess('User created successfully'); // Set the success message
      fetchUsers();
  
      // Clear the success message after a few seconds (optional)
      setTimeout(() => {
        setUserCreationSuccess('');
      }, 3000); // Clear the success message after 3 seconds
    } catch (error) {
      setUserCreationError('Email is already in use');
      console.error('Error creating user:', error);
    }
  };


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
    // Check if the team name is empty and show a validation message if it is
    if (!teamName.trim()) {
      setTeamNameError('Team name is required');
      return; // Exit the function to prevent creating the team
    }

    try {
      const res = await axios.post('/teams', { name: teamName }, { withCredentials: true });
      console.log(res);
      setTeamName('');
      setTeamNameError(''); // Clear the validation message
      setTeamCreationSuccess('Team created successfully'); // Set the success message
      fetchTeams();

      // Clear the success message after a few seconds (optional)
      setTimeout(() => {
        setTeamCreationSuccess('');
      }, 3000); // Clear the success message after 3 seconds
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
    // Check if any field is left blank
    if (!playerName.trim() || !playerDateOfBirth || !selectedTeam) {
      setPlayerCreationError('All fields are required');
      return; // Exit the function to prevent creating the player
    }

    // Check if the date is today or later
    const today = new Date();
    const selectedDate = new Date(playerDateOfBirth);
    if (selectedDate >= today) {
      setPlayerCreationError('Invalid date. Please select a date in the past.');
      return; // Exit the function to prevent creating the player
    }

    try {
      await axios.post('/players', {
        name: playerName,
        dateOfBirth: playerDateOfBirth,
        team: selectedTeam, // Include the selected team ID in the player data
      });

      setPlayerName('');
      setPlayerDateOfBirth('');
      setSelectedTeam('');
      setPlayerCreationError(''); // Clear the error message
      setPlayerCreationSuccess('Player created successfully'); // Set the success message
      fetchPlayers();

      // Clear the success message after a few seconds (optional)
      setTimeout(() => {
        setPlayerCreationSuccess('');
      }, 3000); // Clear the success message after 3 seconds
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

  async function fetchUsers() {
    try {
      const response = await axios.get("/users", { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  const handleDeleteUser = async (userId) => {
    console.log(userId)
    try {
      await axios.delete(`/users/${userId}`, { withCredentials: true });
      fetchUsers(); // Refresh the user list after deleting a user
    } catch (error) {
      console.error('Error deleting user:', error);
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
          margin="dense"
        />
        <Button variant="contained" color="primary" onClick={handleCreateTeam}>
          Create Team
        </Button>
        {teamNameError && (
          <Typography variant="body2" color="error">
            {teamNameError}
          </Typography>
        )}
        {teamCreationSuccess && (
          <Typography variant="body2" color="success">
            {teamCreationSuccess && <p style={{ color: 'green' }}>{teamCreationSuccess}</p>}
          </Typography>
        )}
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
          {playerCreationError && (
            <Typography variant="body2" color="error">
              {playerCreationError}
            </Typography>
          )}


          <Typography variant="body2" color="green">
            {playerCreationSuccess}
          </Typography>



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
      <Box mt={3}>
        <Typography variant="h5">Create a New User</Typography>
        <TextField
          label="Name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
        />
        <TextField
          label="Email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
        />
        <TextField
          label="Password"
          value={newUserPassword}
          onChange={(e) => setNewUserPassword(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
          type="password"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isSuperUser}
              onChange={(e) => setIsSuperUser(e.target.checked)}
              color="primary"
            />
          }
          label="Super User"
        />
        <br></br>
        <Button variant="contained" color="primary" onClick={handleCreateUser}>
          Create User
        </Button>
        {userCreationError && (
        <Typography variant="body2" color="error">
          {userCreationError}
        </Typography>
      )}
      {userCreationSuccess && (
        <Typography variant="body2" color="green">
          {userCreationSuccess}
        </Typography>
      )}
      </Box>
      <Box mt={3}>
        <Typography variant="h5">All Users</Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user._id}>
              <ListItemText primary={user.name} secondary={`Email: ${user.email}`} />
              <ListItemSecondaryAction>
                <Button
                  component={Link}
                  to={`/edit-user/${user._id}`}
                  edge="end"
                  aria-label="edit"
                >
                  Edit
                </Button>
                <Button
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteUser(user._id)}
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