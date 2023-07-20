
const Tournament = require("../models/tournament");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function getTournaments(req, res) {
  try {
    console.log("zasto sam tu")
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
    const { name, date, location, format } = req.body;

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

    // Save the updated tournament
    await tournament.save();

    res.json({ message: "Tournament updated successfully", tournament });
  } catch (error) {
    console.error("Error updating tournament:", error);
    res.status(500).json({ message: "An error occurred while updating the tournament" });
  }
}


module.exports = {
  createTournament,
  getTournaments,
  getTournamentsFromUser,
  deleteTournament,
  getTournamentById,
  updateTournament
};
