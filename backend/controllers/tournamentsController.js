
const Tournament = require("../models/tournament");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Team = require("../models/team")
const Game = require("../models/game")
const Group = require("../models/group");
const Schedule = require("../models/schedule");
const { createSchedule } = require("../controllers/schedulesController");
const mongoose = require('mongoose');

async function getTournaments(req, res) {
  try {
    
    const tournaments = await Tournament.find();
    console.log(tournaments)
    res.send(tournaments)

  } catch (error) {

  }

}

async function getTournamentsFromUser(req, res) {
  try {
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
   
    const tournaments = await Tournament.find({ user: decoded.sub });
    res.send(tournaments)

  } catch (error) {

  }

}

async function getTournamentById(req,res){
   try {
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    const id = req.params.id;
    console.log(id)
    const tournaments = await Tournament.findOne({_id:id });
    
    res.send(tournaments)

  } catch (error) {

  }
}


async function createTournament(req, res) {
  try {
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    const { name, date, location, format, selectedTeams,replace } = req.body;
    console.log("start" + replace)
    
    const existingTournament = await Tournament.findOne({ name });
   
    if(replace && existingTournament){
      await existingTournament.deleteOne()
    }

    else if (existingTournament) {
      
      return res.status(400).json({ error: 'Tournament name must be unique' });
    }

    const tournament = await Tournament.create({
      name,
      date,
      location,
      format,
      user: decoded.sub,
      teams: selectedTeams,
      schedule:null
    });

   
    const group1 = new Group({ tournament: tournament, teams: [],teamScores:[] });
    const group2 = new Group({ tournament: tournament, teams: [],teamScores:[] });

    

    
    const numTeams = selectedTeams.length;
    for (let i = 0; i < numTeams; i++) {
      if (i < numTeams / 2) {
        group1.teams.push(selectedTeams[i]);
        group1.teamScores.push({ team:new mongoose.Types.ObjectId(selectedTeams[i]), goalsScored: 0, points: 0 })
      } else {
        group2.teams.push(selectedTeams[i]);
        group2.teamScores.push({ team:new mongoose.Types.ObjectId(selectedTeams[i]), goalsScored: 0, points: 0 })
      }
    }

   
    await group1.save();
    await group2.save();

  


    const schedule = await createSchedulelocal(tournament,group1,group2)
    tournament.schedule = schedule
    await tournament.save()
  
    const simplifiedTournament = {
      _id: tournament._id,
      name: tournament.name,
      date: tournament.date,
      location: tournament.location,
      format: tournament.format,
      user: tournament.user,
      teams: selectedTeams,
     
    };

    res.json(simplifiedTournament)

   
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json(s);
  }
}

async function createSchedulelocal(tournament, group1, group2 ) {
  try {
    

    const createRoundRobinSchedule = async (group,groupNumber) => {
      const games = [];
      const numTeams = group.teams.length;

      const startDateX = new Date(group.tournament.date.getTime() +  24 * 60 * 60 * 1000) 
      const startDateY = new Date(group.tournament.date.getTime())
      let gameTime = 0
      let gameDay = 0
      for (let i = 0; i < numTeams - 1; i++) {
        for (let j = i + 1; j < numTeams; j++) {
          // Determine the appropriate start date based on groupNumber
          const startDate = gameDay%2 ? startDateX : startDateY;
          gameDay++;
          let startHour;
          if (gameTime === 0) {
            startHour = groupNumber === 1 ? 10 : 12; 
          } else if (gameTime === 1) {
            startHour = groupNumber === 1 ? 14 : 16; 
          } else {
            startHour = groupNumber === 1 ? 18 : 20; 
          }
  
          startDate.setHours(startHour);
          const newGame = new Game({
            team1: group.teams[i],
            team2: group.teams[j],
            roundOf: "Group Stage",
            tournament: group.tournament,
            startDate,
            group: group,
          });
          await newGame.save();
          games.push(newGame._id);
          gameTime++;
         
          if(gameTime === 3)
          gameTime = 0
        }
      }
    
      return games;
    };
   
    

    const group1Games = await createRoundRobinSchedule(group1,1);
    const group2Games = await createRoundRobinSchedule(group2,2);


  
    const thirdPlaceGame = new Game({
      team1: null, 
      team2: null,
      roundOf: "3rd Place Game",
      tournament: tournament,
     startDate: new Date(tournament.date.getTime() + 2 * 24 * 60 * 60 * 1000).setHours(18),
    });
    await thirdPlaceGame.save();

    // Create the final game
    const finalGame = new Game({
      team1: null,
      team2: null,
      roundOf: "Final",
      tournament: tournament,
      startDate: new Date(tournament.date.getTime() + 2 * 24 * 60 * 60 * 1000).setHours(20),
    });
    await finalGame.save();

    const schedule = new Schedule({
      tournament,
      group1,
      group2,
      group1Games,
      group2Games,
      thirdPlaceGame: thirdPlaceGame._id,
      final: finalGame._id,
    });

    await schedule.save();
    
    return schedule
  } catch (error) {
    console.error('Error creating schedule:', error);
    
  }
}


module.exports = {
  createTournament,
};
async function deleteTournament(req, res) {
  try {ee
    //console.log(req.cookies)
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    //console.log(decoded);
    console.log(req.params.id)
    const { id } = req.params.id;
    const tournament = await Tournament.findByIdAndDelete(req.params.id );
    console.log(id)
    //console.log(decoded.sub)
    res.sendStatus(200)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function updateTournament(req, res) {
  try {
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);

    // Get the tournament ID from the request parameters
    const tournamentId = req.params.id;
    
    // Check if the user is authorized to update the tournament
    const tournament = await Tournament.findOne({ _id: req.params.id });
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Verify that the user making the request is the owner of the tournament
    if (tournament.user.toString() !== decoded.sub) {
      return res.status(403).json({ message: "You are not authorized to update this tournament" });
    }
    //console.log(req.body.tournament)
    if(req.body.finalised){
      tournament.finalised = true;
      await tournament.save()
      res.sendStatus(200)
      return;
    }
    // Extract the updated tournament data from the request body
    const { name, date, location, format,teams,finalised } = req.body.tournament;
    const Teams = new Team([teams]);
    //console.log(teams )
    // Check if a tournament with the updated name already exists
    const existingTournament = await Tournament.findOne({ name });
    if (existingTournament && existingTournament._id.toString() !== tournamentId) {
      return res.status(409).json({ message: "A tournament with the updated name already exists" });
    }

    // Update the tournament document in the database
    tournament.name = name;
    tournament.date = date;
    tournament.location = location;
    tournament.format = format;
    tournament.teams = teams
    tournament.finalised = finalised
    // Save the updated tournament
    await tournament.save();

    res.json({ message: "Tournament updated successfully", tournament });
  } catch (error) {
    console.error("Error updating tournament:", error);
    res.status(500).json({ message: "An error occurred while updating the tournament" });
  }
}

async function simulateTournament(req, res) {
  console.log(req.body.tournament_id);
  const tournament_id = req.body.tournament_id;
  const tournament = await Tournament.findById(tournament_id);
  const teams = [];

  if (!tournament) {
    console.log("Tournament not found!");
    return res.status(404).json({ error: "Tournament not found" });
  }

  const teamPromises = tournament.teams.map(async (team) => {
    const teamData = await Team.findById(team);
    return teamData;
  });

  try {
    const teamsData = await Promise.all(teamPromises);
    console.log(teamsData);

    shuffleArray(teamsData)

    // Now 'teamsData' will have all the team data retrieved from the database
    //res.status(200).json({ teams: teamsData });
  
  let offset = 0;
  while (teamsData.length > 1) {
    let roundOf = 1;
    //Determening which round is it
    while (roundOf * 2 < teamsData.length) {
    roundOf *= 2;
  }
  roundOf *= 2;
    const team1 = teamsData.splice(offset, 1)[0]; // Access the first team directly
    const team2 = teamsData.splice(offset, 1)[0]; // Access the second team directly
  
    const min = 0; // The minimum value for the random numbers
    const max = 10; // The maximum value for the random numbers
  
    // Generate the first random number
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  
    // Generate the second random number, ensuring it's different from the first one
    let num2;
    do {
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (num2 === num1);
  
    if (num1 > num2)
      teamsData.splice(offset, 0, team1);
    else
      teamsData.splice(offset, 0, team2);
  
    const response = await Game.create({
      team1: team1._id, // Access the _id of the first team object
      team2: team2._id, // Access the _id of the second team object
      roundOf,
      team1Score: num1,
      team2Score: num2,
      tournament:tournament._id
    });
  }
  tournament.isDone = true;
  tournament.save();
  res.sendStatus(200)
} catch (error) {
  console.log("Error retrieving team data:", error);
  res.status(500).json({ error: "Error retrieving team data" });
}

}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function getTournamentDetails(req,res){
  const tournament_id = req.params.id;
  console.log(tournament_id)
  const tournament = await Tournament.findById(tournament_id)
  //console.log(tournament)
  

  const teamPromises = tournament.teams.map(async (team) => {
    const teams = await Team.findById(team);
    return teams;
  });

  const games = await Game.find({tournament:tournament._id}) 

    const teams = await Promise.all(teamPromises);
    console.log(games);

    res.send({tournament,teams,games})
  

}


module.exports = {
  createTournament,
  getTournaments,
  getTournamentsFromUser,
  deleteTournament,
  getTournamentById,
  updateTournament,
  simulateTournament,
  getTournamentDetails
};
