const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team', // Reference the 'Team' model
    required: true,
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team', // Reference the 'Team' model
    required: true,
  },
  roundOf: {
    type: Number,
  },
  team1Score: {
    type: Number,
  },
  team2Score: {
    type: Number,
  },
  tournament: {
    type: String,
  }
});

// Create a virtual field 'team1Name' to access the team1's name
gameSchema.virtual('team1Name', {
  ref: 'Team', // Reference the 'Team' model
  localField: 'team1',
  foreignField: '_id',
  justOne: true,
});

// Create a virtual field 'team2Name' to access the team2's name
gameSchema.virtual('team2Name', {
  ref: 'Team', // Reference the 'Team' model
  localField: 'team2',
  foreignField: '_id',
  justOne: true,
});

// Include virtual fields in the JSON output
gameSchema.set('toJSON', { virtuals: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
