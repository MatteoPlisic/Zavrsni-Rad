
const Tournament = require("../models/tournament");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Team = require("../models/team")
const Game = require("../models/game")

async function getTournaments(req, res) {
  try {
    
    const tournaments = await Tournament.find();
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
    //console.log(req.cookies)
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    // console.log(decoded);
    const { name, date, location, format,selectedTeams } = req.body;
    
     console.log(req.body);

    // Check if a tournament with the same name already exists
    const existingTournament = await Tournament.findOne({ name });
    if (existingTournament) {
      return res.status(400).json({ error: 'Tournament name must be unique' });
    }

    const resp = await Tournament.create({ name, date, location, format, user: decoded.sub,teams:selectedTeams });
    //console.log(resp);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function deleteTournament(req, res) {
  try {
    //console.log(req.cookies)
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    //console.log(decoded);

    const { tournament_id } = req.body;
    const tournament = await Tournament.findOne(tournament_id);
    console.log(tournament.user.toString())
    console.log(decoded.sub)
    if (tournament.user.toString() === decoded.sub) {

      await Tournament.deleteOne({ tournament_id });
      res.sendStatus(200);

    }
    // console.log(date);
    else {
      res.sendStatus(401)
    }
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
    const tournament = await Tournament.findOne({ _id: tournamentId });
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Verify that the user making the request is the owner of the tournament
    if (tournament.user.toString() !== decoded.sub) {
      return res.status(403).json({ message: "You are not authorized to update this tournament" });
    }

    // Extract the updated tournament data from the request body
    const { name, date, location, format,selectedTeams } = req.body;
    const teams = new Team([selectedTeams]);
    console.log(teams )
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
    tournament.teams = selectedTeams
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
      tournament
    });
  }
  tournament.isDone = true;
  tournament.save();
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



module.exports = {
  createTournament,
  getTournaments,
  getTournamentsFromUser,
  deleteTournament,
  getTournamentById,
  updateTournament,
  simulateTournament
};
