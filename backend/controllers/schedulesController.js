const Schedule = require("../models/schedule");
const Group = require("../models/group");
const Game = require("../models/game");

async function createSchedule(req, res) {
  try {
    const { tournament, group1, group2 } = req.body;

    // Helper function to create a round-robin schedule for a given group
    const createRoundRobinSchedule = async (group) => {
      const games = [];
      const numTeams = group.teams.length;

      for (let i = 0; i < numTeams; i++) {
        for (let j = i + 1; j < numTeams; j++) {
          // Create a game for each pair of teams
          const newGame = new Game({
            team1: group.teams[i],
            team2: group.teams[j],
            roundOf: "Group Stage",
            tournament: tournament,
            startDate: new Date(), // Replace this with the actual start date and time
          });
          await newGame.save();
          games.push(newGame._id);
        }
      }

      return games;
    };

    // Create round-robin schedules for both groups
    const group1Games = await createRoundRobinSchedule(group1);
    const group2Games = await createRoundRobinSchedule(group2);

    // Create the 3rd place game
    const thirdPlaceGame = new Game({
      team1: "teamId1", // Replace with the actual team ID
      team2: "teamId2", // Replace with the actual team ID
      roundOf: "3rd Place Game",
      tournament: tournament,
      startDate: new Date(), // Replace this with the actual start date and time
    });
    await thirdPlaceGame.save();

    // Create the final game
    const finalGame = new Game({
      team1: "teamId3", // Replace with the actual team ID
      team2: "teamId4", // Replace with the actual team ID
      roundOf: "Final",
      tournament: tournament,
      startDate: new Date(), // Replace this with the actual start date and time
    });
    await finalGame.save();

    // Create the schedule with the group and game information
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
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function createSchedulelocal(tournament, group1, group2 ) {
  try {
    

    // Helper function to create a round-robin schedule for a given group
    const createRoundRobinSchedule = async (group) => {
      const games = [];
      const numTeams = group.teams.length;

      for (let i = 0; i < numTeams; i++) {
        for (let j = i + 1; j < numTeams; j++) {
          // Create a game for each pair of teams
          const newGame = new Game({
            team1: group.teams[i],
            team2: group.teams[j],
            roundOf: "Group Stage",
            tournament: tournament,
            startDate: new Date(), // Replace this with the actual start date and time
          });
          await newGame.save();
          games.push(newGame._id);
        }
      }

      return games;
    };

    // Create round-robin schedules for both groups
    const group1Games = await createRoundRobinSchedule(group1);
    const group2Games = await createRoundRobinSchedule(group2);
    for (let i = 0; i < 3; i++) {
      if(i<2){
        group1Games[i].date = new Date(tournament.date.getTime() +  24 * 60 * 60 * 1000)
        group2Games[2].date = new Date(tournament.date.getTime() +  24 * 60 * 60 * 1000)
      }
      else{
        group2Games[i].date = new Date(tournament.date.getTime())
        group1Games[2].date = new Date(tournament.date.getTime())
      }
      
    }
    // Create the 3rd place game
    const thirdPlaceGame = new Game({
      team1: "teamId1", // Replace with the actual team ID
      team2: "teamId2", // Replace with the actual team ID
      roundOf: "3rd Place Game",
      tournament: tournament,
      startDate: new Date(tournament.date.getTime() + 2 * 24 * 60 * 60 * 1000), // Replace this with the actual start date and time
    });
    await thirdPlaceGame.save();

    // Create the final game
    const finalGame = new Game({
      team1: "teamId3", // Replace with the actual team ID
      team2: "teamId4", // Replace with the actual team ID
      roundOf: "Final",
      tournament: tournament,
      startDate: new Date(tournament.date.getTime() + 2 * 24 * 60 * 60 * 1000), // Replace this with the actual start date and time
    });
    await finalGame.save();

    // Create the schedule with the group and game information
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
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


async function getSchedules(req, res) {
    try {
      const schedules = await Schedule.find();
      res.json(schedules);
    } catch (error) {
      console.error('Error getting schedules:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }


  async function getScheduleById(req, res) {
    try {
      const scheduleId = req.params.id;
      const schedule = await Schedule.findById(scheduleId)
       .populate({ path: 'group1', populate: { path: 'teams teamScores.team teamInfo' } })
  .populate({ path: 'group2', populate: { path: 'teams teamScores.team teamInfo' } })
  .populate({ path: 'group1Games', populate: { path: 'team1 team2', select: 'name' } })
  .populate({ path: 'group2Games', populate: { path: 'team1 team2', select: 'name' } })
  .populate({ path: 'thirdPlaceGame', populate: { path: 'team1 team2', select: 'name' } })
  .populate({ path: 'final', populate: { path: 'team1 team2', select: 'name' } });
  
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
  
      res.json(schedule);
    } catch (error) {
      console.error('Error getting schedule:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
  module.exports = {
    createSchedule,
    getSchedules,
    getScheduleById,
    createSchedulelocal
  };
  
  
