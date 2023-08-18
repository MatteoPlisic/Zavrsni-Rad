import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useFetcher } from 'react-router-dom';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { green, yellow } from '@mui/material/colors';

const MyTournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [refresh,setRefresh] = useState(false)
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
  });

  async function readyTournament(tournament) {
    try {
      tournament.finalised = true
      const id = tournament._id
      console.log(id)
      const response = await axios.put(`/tournaments/${id}`,{tournament},{withCredentials:true})
      console.log(response)
      // No need to log 'tournaments' here.
    } catch (error) {
      console.log(error);
    }
  }
  

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/my-tournaments/${id}`, { withCredentials: true });
      console.log(res)
      setTournaments(tournaments.filter((tournament) => tournament._id !== id));
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
      <TableContainer component={Paper} style={{ maxWidth: '900px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
              <TableCell></TableCell>
              <TableCell>Played</TableCell>
              <TableCell>Simulate</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {tournaments.map((tournament) => (
              <TableRow key={tournament._id}>
                <TableCell>{tournament.name}</TableCell>
                <TableCell>{tournament.location}</TableCell>
                <TableCell>{tournament.date}</TableCell>
                <TableCell>
                 {!tournament.isDone && <Button component={Link} to={`/edit-tournament/${tournament._id}`}>
                    Edit
                  </Button>}
                  {tournament.isDone && <Button component={Link} to={`/tournament-details/${tournament._id}`}>
                    See details
                  </Button>}
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
                <TableCell>
                {!tournament.finalised && <Button color='warning' variant='contained' onClick={() => readyTournament(tournament)}>Tournament is ready</Button>}
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
