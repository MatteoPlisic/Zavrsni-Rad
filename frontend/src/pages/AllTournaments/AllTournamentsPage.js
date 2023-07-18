import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider, Container } from '@mui/material';

const AllTournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    async function getTournaments() {
      try {
        const res = await axios.get('/tournaments');
        setTournaments(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getTournaments();
  }, []);

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop: '100px' }} >
      <TableContainer component={Paper} style={{ maxWidth: '800px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tournament Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {tournaments.map((tournament) => (
              <TableRow key={tournament.id}>
                <TableCell>{tournament.name}</TableCell>
                <TableCell>{tournament.location}</TableCell>
                <TableCell>{tournament.date}</TableCell>
                <TableCell><Button>See More</Button></TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AllTournamentsPage;
