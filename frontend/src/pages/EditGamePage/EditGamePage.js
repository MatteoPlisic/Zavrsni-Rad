import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Grid, TextField, Button, touchRippleClasses } from '@mui/material';

export const EditGamePage = () => {
  const { id } = useParams("id");
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const navigate = useNavigate()
  const [tournament,setTournament] = useState()

  useEffect(() => {
    async function getGame() {
      try {
        const response = await axios.get(`/game/${id}`);
        const gameData = response.data;

        // Extract relevant data from the API response
        const { team1, team2 } = gameData;
        setTournament(gameData.tournament )
        // Assuming the API response contains team names as 'name' property
        setTeam1Name(team1.name || 'Team 1');
        setTeam2Name(team2.name || 'Team 2');
        setTeam1Score( 0);
        setTeam2Score( 0);

        console.log(gameData);
      } catch (error) {
        console.error('Error fetching game:', error);
      }
    }
    getGame();
  }, [id]);

  async function saveResult(){
    try {
        const updatedGameData = {
          team1Score: team1Score,
          team2Score: team2Score,
        };
    
        const response = await axios.put(`/game/${id}`, updatedGameData, {
          withCredentials: true,
        });
        
        // Handle successful update
        console.log('Game updated:', response.data);
        // You can add any additional logic or feedback for successful update here
        navigate(`/edit-tournament/${tournament}`)
      } catch (error) {
        console.error('Error updating game:', error);
        // Handle the error appropriately, such as showing an error message to the user
      }
    }
    
   
  

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }} marginTop={"50px"}>
      <Grid item xs={12} sm={6} md={4}>
        <div style={{ padding: '20px' }}>
          <Typography variant="h5" align="center" gutterBottom></Typography>
          <Typography variant="body1" gutterBottom align="center">
            {team1Name}
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            vs
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            {team2Name}
          </Typography>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item>
              <Typography variant="body1" align="center">
                {team1Score}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" align="center">
                -
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" align="center">
                {team2Score}
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="column" alignItems="center" style={{ marginTop: '20px' }}>
            <Grid item>
              <TextField
                type="number"
                label={team1Name}
                variant="outlined"
                value={team1Score}
                onChange={(e) => setTeam1Score(parseInt(e.target.value))}
              />
            </Grid>
            <Grid item>
              <Typography variant="h4">-</Typography>
            </Grid>
            <Grid item>
              <TextField
                type="number"
                label={team2Name}
                variant="outlined"
                value={team2Score}
                onChange={(e) => setTeam2Score(parseInt(e.target.value))}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={saveResult}>
              Save
            </Button>
           {/*<Button variant="contained" color="secondary">
              //  Finish Game
  //</Button>*/}
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};
