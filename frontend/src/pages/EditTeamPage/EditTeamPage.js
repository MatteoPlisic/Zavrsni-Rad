import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button } from '@mui/material';

const EditTeamPage = () => {
  const { id } = useParams();
    const navigate = useNavigate('')
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/teams/${id}`, { withCredentials: true });
      setTeamName(response.data.name);
      console.log(response.data.name)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team:', error);
      setLoading(false);
    }
  };

  const handleEditTeam = async () => {
    try {
      setLoading(true);
      await axios.put(`/teams/${id}`, { name: teamName });
      setLoading(false);
      navigate('/administration'); // Redirect to the administration page after editing the team
    } catch (error) {
      console.error('Error editing team:', error);
      setLoading(false);
    }
  };

  return (
    <Box p={3} marginTop={"50px"}>
      <Typography variant="h4" gutterBottom>
        Edit Team
      </Typography>

      {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <>
          <TextField
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleEditTeam}>
            Save Changes
          </Button>
        </>
      )}
    </Box>
  );
};

export default EditTeamPage;
