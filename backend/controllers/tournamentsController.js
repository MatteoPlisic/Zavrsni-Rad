const Tournament = require("../models/tournament");


async function getTournaments(req, res){
    try {
    const tournaments = await Tournament.find();
    res.send(tournaments)
    
    } catch (error) {
        
    }
    
}
async function createTournament(req, res) {
  try {
    const { name } = req.body;

    // Check if a tournament with the same name already exists
    const existingTournament = await Tournament.findOne({ name });
    if (existingTournament) {
      return res.status(400).json({ error: 'Tournament name must be unique' });
    }

    const resp = await Tournament.create({ name });
    console.log(resp);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

module.exports = {
  createTournament,
  getTournaments
};
