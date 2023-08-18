import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, FormControl, MenuItem, Select, } from '@mui/material';
import { Checkbox, FormLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';


const EditTournamentPage = () => {
  const { id } = useParams(); // Get the tournament ID from the URL
  const [validationMessage, setValidationMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [format, setFormat] = useState('4');
  const [selectedTeams, setSelectedTeams] = useState([])
  const [teams, setTeams] = useState([])
  const [schedule, setSchedule] = useState('')
  const [finalised, setFinalised] = useState(false)
  const [thirdPlaceGame, setThirdPlaceGame] = useState()
  const navigate = useNavigate('')

  const handleCheckboxChange = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      // If the team ID exists in the selectedTeams array, remove it
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
    } else {
      // If the team ID does not exist in the selectedTeams array, add it
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  useEffect(() => {
    const fetchTournament = async () => {
      try {

        const tournament = await axios.get(`/tournaments/${id}`, { withCredentials: true });
        const Allteams = await axios.get("/teams", { withCredentials: true });
        if(tournament.data.schedule){
        const Schedule = await axios.get(`/schedule/${tournament.data.schedule}`)

        const game = await axios.get(`/game/${Schedule.data.final._id}`)
        //console.log(game)
        //console.log(Schedule)
        // console.log(tournament)
        setSchedule(Schedule)
        }
        setTeams(Allteams.data)
        //console.log(teams)
        const getteams = tournament.data.teams
        //console.log(tournament)
        setName(tournament.data.name)
        setDate(new Date(tournament.data.date).toISOString().split('T')[0])
        setLocation(tournament.data.location)
        setFormat(tournament.data.format.toString())
        setSelectedTeams(getteams);
        setFinalised(tournament.data.finalised)
        // console.log(selectedTeams)
       // console.log(Schedule.data)
      } catch (error) {
        console.error('Error fetching tournament:', error);
      }
    };

    fetchTournament();
  }, []);

  async function endGroup(id) {
    const res = await axios.get(`/finish-group/${id}`)
    if (schedule.data.group1[0]._id === id) {
      schedule.data.group1[0].isFinished = true
    }
    else {
      schedule.data.group2[0].isFinished = true
    }
    if ((schedule.data.group1[0].isFinished === true) && schedule.data.group1[0].isFinished === true) {
      await axios.get(`http://localhost:3000/schedule-finals/${schedule.data._id}`)
    }
    window.location.reload(false);
    console.log(res)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();

      if (Date.parse(date) < currentDate) {
        setValidationMessage("Date needs to be equal or greater than today");
        setSuccessMessage('');
      } else {
       
        //const response = await axios.put(`/tournaments/${id}`, { name, date, location, format, teams:selectedTeams }, { withCredentials: true });
       //const response = await axios.delete(`/my-tournaments/${id}`,{withCredentials:true})
       //const response2 = await axios.post('/tournaments', { name, date, location, format, selectedTeams }, { withCredentials: true });
       
       const response3 = await axios.post('/tournaments', { name, date, location, format, selectedTeams,replace:true }, { withCredentials: true });
       console.log(response3)
       console.log("ASD")
       if (response3.status === 200) {
         
       }
       

       console.log('Tournament updated:');
        setSuccessMessage('Tournament updated:');
      
        setValidationMessage('');
        const response = await axios.delete(`/my-tournaments/${id}`,{withCredentials:true})
        navigate('/my-tournaments')
      }
    } catch (error) {
      console.error('Error updating tournament:', error);
      console.log(error);

      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setValidationMessage("Invalid request. Please check your data.");
          setSuccessMessage('');
        } else if (status === 404) {
          setValidationMessage("Tournament not found.");
          setSuccessMessage('');
        } else if (status === 409) {
          setValidationMessage("A tournament with the updated name already exists.");
          setSuccessMessage('');
        } else {
          setValidationMessage("An error occurred while updating the tournament.");
          setSuccessMessage('');
        }
      } else {
        setValidationMessage("An error occurred while updating the tournament.");
        setSuccessMessage('');
      }
    }
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
    <Container maxWidth="sm">
      <h2>Edit Tournament</h2>
      {!finalised && (
        <>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                color="warning"
              >
                <MenuItem value="8">8 teams</MenuItem>
                <MenuItem value="16">16 teams</MenuItem>
                <MenuItem value="32">32 teams</MenuItem>
                <MenuItem value="4">4 teams</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {validationMessage && <p style={{ color: 'red' }}>{validationMessage}</p>}
          </form>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Selected</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team._id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        // Check if the team is in the selectedTeams array
                        checked={selectedTeams.includes(team._id)}
                        // Handle checkbox state change
                        onChange={() => handleCheckboxChange(team._id)}
                      />
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        </>
      )}

      
      {/* Display the schedule */}
      {finalised && (
        <>
          <h2>Group 1</h2>
          {!schedule.data.group1[0].isFinished &&
            <Button onClick={() => endGroup(schedule.data.group1[0]._id)}>
              End Group
            </Button>}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Team</TableCell>
                  <TableCell>Goals Differential</TableCell>
                  <TableCell>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.data.group1[0].teamScores.sort((a, b) => {
                  if (b.points !== a.points) {
                    return b.points - a.points; // Sort by points in descending order
                  } else {
                    return b.goalsScored - a.goalsScored; // If points are equal, sort by goalsScored in descending order
                  }
                })
                  .slice() // Create a copy of the array to avoid modifying the original array
                  .sort((a, b) => b.points - a.points) // Sort the array by points in descending order
                  .map((teamScore) => (
                    <TableRow key={teamScore._id}>
                      <TableCell>{teamScore.team.name}</TableCell>
                      <TableCell>{teamScore.goalsScored}</TableCell>
                      <TableCell>{teamScore.points}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {finalised && (
        <>
          <h2>Group 2</h2>
          {!schedule.data.group2[0].isFinished &&
            <Button onClick={() => endGroup(schedule.data.group2[0]._id)}>
              End Group
            </Button>}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Team</TableCell>
                  <TableCell>Goals Differential</TableCell>
                  <TableCell>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.data.group2[0].teamScores.sort((a, b) => {
                  if (b.points !== a.points) {
                    return b.points - a.points; // Sort by points in descending order
                  } else {
                    return b.goalsScored - a.goalsScored; // If points are equal, sort by goalsScored in descending order
                  }
                })
                  .slice() // Create a copy of the array to avoid modifying the original array
                  .sort((a, b) => b.points - a.points) // Sort the array by points in descending order
                  .map((teamScore) => (
                    <TableRow key={teamScore._id}>
                      <TableCell>{teamScore.team.name}</TableCell>
                      <TableCell>{teamScore.goalsScored}</TableCell>
                      <TableCell>{teamScore.points}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {finalised && (
        <>
          <h2>Raspored</h2>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Phase</TableCell>
                  <TableCell>team1</TableCell>
                  <TableCell>team2</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...schedule.data.group1Games, ...schedule.data.group2Games]
                  .sort((game1, game2) => new Date(game1.startDate) - new Date(game2.startDate))
                  .map((game) => (
                    <TableRow key={game._id}>
                      <TableCell>{game.roundOf}</TableCell>
                      <TableCell>{game.team1.name}</TableCell>
                      <TableCell>{game.team2.name}</TableCell>
                      <TableCell>{formatDate(game.startDate)} at {formatTime(game.startDate)}</TableCell>
                      <TableCell>
                        {(game.team1Score > -1 && game.team2Score > -1) ? `${game.team1Score} - ${game.team2Score}` :
                          <Button component={Link} to={`/edit-game/${game._id}`}>
                            Edit
                          </Button>
                        }
                      </TableCell>
                    </TableRow>
                  ))}



                {schedule.data.thirdPlaceGame && (
                  <TableRow key={schedule.data.thirdPlaceGame._id}>
                    <TableCell>{schedule.data.thirdPlaceGame.roundOf}</TableCell>
                    <TableCell>
                      {schedule.data.thirdPlaceGame.team1 && schedule.data.thirdPlaceGame.team1.name
                        ? schedule.data.thirdPlaceGame.team1.name
                        : "To be determined"}
                    </TableCell>
                    <TableCell>
                      {schedule.data.thirdPlaceGame.team2 && schedule.data.thirdPlaceGame.team2.name
                        ? schedule.data.thirdPlaceGame.team2.name
                        : "To be determined"}
                    </TableCell>
                    <TableCell>
                      {schedule.data.thirdPlaceGame.startDate
                        ? formatDate(schedule.data.thirdPlaceGame.startDate) + " at " + formatTime(schedule.data.thirdPlaceGame.startDate)
                        : "To be determined"}
                    </TableCell>
                    <TableCell>
                        {(schedule.data.thirdPlaceGame.team1Score > -1 && schedule.data.thirdPlaceGame.team2Score > -1) ? `${schedule.data.thirdPlaceGame.team1Score} - ${schedule.data.thirdPlaceGame.team2Score}` :
                          <Button component={Link} to={`/edit-game/${schedule.data.thirdPlaceGame._id}`}>
                            Edit
                          </Button>
                        }
                      </TableCell>
                  </TableRow>


                )}
                {schedule.data.final && (
                  <TableRow key={schedule.data.final._id}>
                    <TableCell>{schedule.data.final.roundOf}</TableCell>
                    <TableCell>
                      {schedule.data.final.team1 && schedule.data.final.team1.name
                        ? schedule.data.final.team1.name
                        : "To be determined"}
                    </TableCell>
                    <TableCell>
                      {schedule.data.final.team2 && schedule.data.final.team2.name
                        ? schedule.data.final.team2.name
                        : "To be determined"}
                    </TableCell>
                    <TableCell>
                      {schedule.data.final.startDate
                        ? formatDate(schedule.data.final.startDate) + " at " + formatTime(schedule.data.final.startDate)
                        : "To be determined"}
                    </TableCell>
                    
                    <TableCell>
                        {(schedule.data.final.team1Score > -1 && schedule.data.final.team2Score > -1) ? `${schedule.data.final.team1Score} - ${schedule.data.final.team2Score}` :
                          <Button component={Link} to={`/edit-game/${schedule.data.final._id}`}>
                            Edit
                          </Button>
                        }
                      </TableCell>
                    
                  </TableRow>
                )}
                      

              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      

    </Container>
  );
};

export default EditTournamentPage;
