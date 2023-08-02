import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, ListItemText } from '@mui/material';

const SingleTournamentPage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function getTournament() {
      try {
        const res = await axios.get(`/tournament/details/${id}`);
        console.log(res)
        setTournament(res.data.tournament);
        setGames(res.data.games);
        setTeams(res.data.teams);
      } catch (error) {
        console.log(error);
      }
    }
    getTournament();
  }, [id]);

  // Update document title with the tournament name when the tournament is loaded
  useEffect(() => {
    if (tournament) {
      document.title = tournament.name;
    }
  }, [tournament]);

  const getTeamName = (teamId) => {
    const team = teams.find((team) => team._id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  return (
    <div style={{ padding: '50px' }}>
      {tournament && (
        <>
          <Typography variant="h3">{tournament.name}</Typography>

          <Typography variant="h5">Games:</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Team 1</TableCell>
                  <TableCell>Team 2</TableCell>
                  <TableCell>Round Of</TableCell>
                  <TableCell>Team 1 Score</TableCell>
                  <TableCell>Team 2 Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game._id}>
                    <TableCell>{getTeamName(game.team1)}</TableCell>
                    <TableCell>{getTeamName(game.team2)}</TableCell>
                    <TableCell>{game.roundOf}</TableCell>
                    <TableCell>{game.team1Score}</TableCell>
                    <TableCell>{game.team2Score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5">Teams:</Typography>
          <List>
            {teams.map((team) => (
              <ListItem key={team._id}>
                <ListItemText primary={team.name} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </div>
  );
};

export default SingleTournamentPage;
