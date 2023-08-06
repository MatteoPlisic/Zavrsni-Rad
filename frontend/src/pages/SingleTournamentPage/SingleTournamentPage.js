import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, ListItemText } from '@mui/material';

const SingleTournamentPage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    async function getTournament() {
      try {
        const res = await axios.get(`/tournament/details/${id}`);
        const scheduleRes = await axios.get(`/schedule/${res.data.tournament.schedule}`);
        setSchedule(scheduleRes.data);
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
    return team ? team.name : 'To be determined';
  };

  const formatDate = (dateString) => {
    const startDate = new Date(dateString);

    const day = startDate.getDate().toString().padStart(2, '0');
    const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const year = startDate.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Function to format the time in "hh:mm" format
  const formatTime = (dateString) => {
    const startDate = new Date(dateString);

    const hours = startDate.getHours().toString().padStart(2, '0');
    const minutes = startDate.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  return (
    <div style={{ padding: '50px' }}>
      {tournament && (
        <>
          <Typography variant="h3">{tournament.name}</Typography>

          {/* Table for schedule.group1.teamScores */}
          {schedule && schedule.group2 && (
            <div>
              <Typography variant="h5">Group 1:</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell>Goal difference</TableCell>
                      <TableCell>Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedule.group2[0].teamScores.sort((a, b) => {
                      if (b.points !== a.points) {
                        return b.points - a.points; // Sort by points in descending order
                      } else {
                        return b.goalsScored - a.goalsScored; // If points are equal, sort by goalsScored in descending order
                      }
                    }).map((teamScore) => (
                      <TableRow key={teamScore._id}>
                        <TableCell>{teamScore.team.name}</TableCell>
                        <TableCell>{teamScore.goalsScored}</TableCell>
                        <TableCell>{teamScore.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          {schedule && schedule.group1 && (
            <div>
              <Typography variant="h5">Group 2 :</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell>Goal difference</TableCell>
                      <TableCell>Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedule.group1[0].teamScores.sort((a, b) => {
                      if (b.points !== a.points) {
                        return b.points - a.points; // Sort by points in descending order
                      } else {
                        return b.goalsScored - a.goalsScored; // If points are equal, sort by goalsScored in descending order
                      }
                    }).map((teamScore) => (
                      <TableRow key={teamScore._id}>
                        <TableCell>{teamScore.team.name}</TableCell>
                        <TableCell>{teamScore.goalsScored}</TableCell>
                        <TableCell>{teamScore.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}

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
                {games.sort((a, b) => {
                  if (a.startDate && b.startDate) {
                    return new Date(a.startDate) - new Date(b.startDate);
                  }
                  // If either startDate is missing, consider the one with startDate as greater (bottom)
                  return !a.startDate ? 1 : -1;
                }).map((game) => (
                  <TableRow key={game._id}>
                    <TableCell>{getTeamName(game.team1)}</TableCell>
                    <TableCell>{getTeamName(game.team2)}</TableCell>
                    <TableCell>{game.roundOf}</TableCell>
                    <TableCell>{game.team1Score > -1 ? game.team1Score : "will be played on"}</TableCell>
                    <TableCell>{game.team2Score > -1 ? game.team2Score : formatDate(game.startDate) +" at "+ formatTime(game.startDate)}</TableCell>
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
