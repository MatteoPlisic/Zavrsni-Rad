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
      ref: "Team", // Reference the Team model
    },
  ],
  group2: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team", // Reference the Team model
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

// Use 'populate' to get the actual team objects for group1
scheduleSchema.virtual("group1Info", {
  ref: "Group",
  localField: "group1",
  foreignField: "teams",
  justOne: false,
  options: { populate: { path: "teams" } }, // Populate the 'teams' field of the 'Group' model
});

// Use 'populate' to get the actual team objects for group2
scheduleSchema.virtual("group2Info", {
  ref: "Group",
  localField: "group2",
  foreignField: "teams",
  justOne: false,
  options: { populate: { path: "teams" } }, // Populate the 'teams' field of the 'Group' model
});

// Use 'populate' to get the actual game objects for group1 games
scheduleSchema.virtual("group1GamesInfo", {
  ref: "Game",
  localField: "group1Games",
  foreignField: "_id",
  justOne: false,
  options: { populate: { path: "team1 team2" } }, // Populate the 'team1' and 'team2' fields of the 'Game' model
});

// Use 'populate' to get the actual game objects for group2 games
scheduleSchema.virtual("group2GamesInfo", {
  ref: "Game",
  localField: "group2Games",
  foreignField: "_id",
  justOne: false,
  options: { populate: { path: "team1 team2" } }, // Populate the 'team1' and 'team2' fields of the 'Game' model
});


const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
