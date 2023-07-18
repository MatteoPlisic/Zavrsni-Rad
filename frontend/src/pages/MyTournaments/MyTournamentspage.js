import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';




const MyTournamentspage = () => {
  const [tournaments, setTournaments] = useState([]);

  async function getTournamentsFromUser(){
    const res = await axios.get('/my-tournaments',{withCredentials:true})
    setTournaments(res.data)
  }
  getTournamentsFromUser()  

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:"100px" }} >
      <TableContainer component={Paper} style={{ maxWidth: '800px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tournaments.map((tournament) => (
            <TableRow key={tournament._id}>
              <TableCell>{tournament.name}</TableCell>
              <TableCell>{tournament.location}</TableCell>
              <TableCell>{tournament.date}</TableCell>
              <TableCell>
                <Button component={Link} to={`/edit-event/${tournament._id}`}>
                  Edit 
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </Container>
  )
}

export default MyTournamentspage