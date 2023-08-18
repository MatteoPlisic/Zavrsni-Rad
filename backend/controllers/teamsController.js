const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Team = require("../models/team")






async function getTeams(req, res) {
    try {
        const token = req.cookies.Authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        

       const teams = await Team.find();
       
       res.send(teams)

    } catch (error) {

    }


}

async function getTeamById(req, res) {
    try {
        const token = req.cookies.Authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const {id} = req.params;

        const team =await Team.findById(id)
        console.log(team)
        res.send(team)

    } catch (error) {

    }


}

async function createTeam(req, res) {
    try {
        const token = req.cookies.Authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const {name} = req.body;
        console.log(name)
        await Team.create({name})
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }


}



async function deleteTeam(req, res) {
    try {
        const token = req.cookies.Authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const {id} = req.params
       
        const team = await Team.findById(id);
        console.log(team)
        if(!team){
            return res.status(404).json({error:"Team not found"})
        }
        await team.deleteOne()
        res.json({ message: 'Team deleted successfully' });

    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'Server error' });
    }

}


async function updateTeam(req, res) {
    const { id } = req.params;
    const { name } = req.body;
  
    try {
      // Find the team by ID
      const team = await Team.findById(id);
  
      // If the team with the given ID is not found, return an error response
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
  
      // Update the team's name
      team.name = name;
  
      // Save the updated team in the database
      const updatedTeam = await team.save();
  
      // Return the updated team as the response
      res.sendStatus(200);
    } catch (error) {
      // If there's an error during the update process, return an error response
      res.status(500).json({ message: 'Error updating team', error: error.message });
    }
  }


module.exports = {
    getTeams,
    getTeamById,
    createTeam,
    deleteTeam,
    updateTeam
}