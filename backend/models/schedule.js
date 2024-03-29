const mongoose = require("mongoose");
const Group = require("./group"); // Import the Group model file
const Game = require("./game"); // Import the Game model file

const scheduleSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  group1: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Reference the Group model
    },
  ],
  group2: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Reference the Group model
    },
  ],
  group1Games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // Reference the Game model
    },
  ],
  group2Games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // Reference the Game model
    },
  ],
  thirdPlaceGame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game", // Reference the Game model
  },
  final: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game", // Reference the Game model
  },
});

// ...

// Use 'populate' to get the entire team objects for group1
scheduleSchema.virtual("group1Info", {
  ref: "Group",
  localField: "group1",
  foreignField: "_id",
  justOne: false,
  options: { populate: { path: "teams" } }, // Populate the 'teams' field of the 'Group' model
});

// Use 'populate' to get the entire team objects for group2
scheduleSchema.virtual("group2Info", {
  ref: "Group",
  localField: "group2",
  foreignField: "_id",
  justOne: false,
  options: { populate: { path: "teams" } }, // Populate the 'teams' field of the 'Group' model
});

// Use 'populate' to get the entire game objects for group1 games
scheduleSchema.virtual("group1GamesInfo", {
  ref: "Game",
  localField: "group1Games",
  foreignField: "_id",
  justOne: false,
  options: { populate: { path: "team1 team2" } }, // Populate the 'team1' and 'team2' fields of the 'Game' model
});

// Use 'populate' to get the entire game objects for group2 games
scheduleSchema.virtual("group2GamesInfo", {
  ref: "Game",
  localField: "group2Games",
  foreignField: "_id",
  justOne: false,
  options: { populate: { path: "team1 team2" } }, // Populate the 'team1' and 'team2' fields of the 'Game' model
});

scheduleSchema.virtual('finalGameInfo', {
  ref: 'Game',
  localField: 'final',
  foreignField: '_id',
  justOne: true,
  options: {
    populate: {
      path: 'team1 team2', // Populate the 'team1' and 'team2' fields of the 'Game' model
      select: 'name', // Select only the 'name' field of the teams
    },
  },
});
// Use 'populate' to get the entire game object for the third place game
scheduleSchema.virtual("thirdPlaceGameInfo", {
  ref: "Game",
  localField: "thirdPlaceGame",
  foreignField: "_id",
  justOne: false,
  // Add the 'populate' option for 'team1' and 'team2' fields within the referenced 'Game' model
  options: { populate: { path: "team1 team2" } },
});


const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
