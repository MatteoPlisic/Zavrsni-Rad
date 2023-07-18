
const Tournament = require("../models/tournament");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function getTournaments(req, res){
    try {
    const tournaments = await Tournament.find();
    res.send(tournaments)
    
    } catch (error) {
        
    }
    
}

async function getTournamentsFromUser(req, res){
  try {
  const token = req.cookies.Authorization;
  const decoded = jwt.verify(token, process.env.SECRET);
  const tournaments = await Tournament.find({user:decoded.sub});
  res.send(tournaments)
  
  } catch (error) {
      
  }
  
}


async function createTournament(req, res) {
  try {
    console.log(req.cookies)
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);
    const {name,date,location} = req.body;
    console.log(date);
    
    // Check if a tournament with the same name already exists
    const existingTournament = await Tournament.findOne({ name });
    if (existingTournament) {
      return res.status(400).json({ error: 'Tournament name must be unique' });
    }

    const resp = await Tournament.create({ name,date,location,user:decoded.sub,  });
    //console.log(resp);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

module.exports = {
  createTournament,
  getTournaments,
  getTournamentsFromUser
};
