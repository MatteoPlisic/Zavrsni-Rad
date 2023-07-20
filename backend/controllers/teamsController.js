const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Team = require("../models/team")






async function getTeams(req, res) {
    try {
        const token = req.cookies.Authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        

       const teams = await Team.find();
       console.log(teams)
       res.send(teams)

    } catch (error) {

    }


}

async function getTeamById(req, res) {
    try {
        const token = req.cookies.Authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const {team_id} = req.body;

        await Team.findOne({team_id})

    } catch (error) {

    }


}

async function createTeam(req, res) {
    try {
        const token = req.cookies.Authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const {name} = req.body;
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
        const {team_id} = req.body;

        await Team.deleteOne({team_id})

    } catch (error) {

    }

}


async function updateTeam(req, res) {

}


module.exports = {
    getTeams,
    getTeamById,
    createTeam,
    deleteTeam,
    updateTeam
}