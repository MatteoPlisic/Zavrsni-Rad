import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { green, yellow } from '@mui/material/colors';

const MyTournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get('/my-tournaments', { withCredentials: true });
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchTournaments();
  }, []);

  const handleDelete = async (tournamentId) => {
    try {
      await axios.delete('/my-tournaments', { params: { tournament_id: tournamentId }, withCredentials: true });
      setTournaments(tournaments.filter((tournament) => tournament._id !== tournamentId));
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
      <TableContainer component={Paper} style={{ maxWidth: '800px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Played</TableCell> 
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tournaments.map((tournament) => (
              <TableRow key={tournament._id}>
                <TableCell>{tournament.name}</TableCell>
                <TableCell>{tournament.location}</TableCell>
                <TableCell>{tournament.date}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/edit-tournament/${tournament._id}`}>
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(tournament._id)}>
                    Delete
                  </Button>
                </TableCell>
                <TableCell>
                  {/* Display "Done" or "To Be Played" based on team.isDone */}
                  {tournament.isDone && <p style={{ color: 'green' }}> Done</p>}
                  {!tournament.isDone && <p style={{ color: 'orange' }}> To be Played</p>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyTournamentsPage;
