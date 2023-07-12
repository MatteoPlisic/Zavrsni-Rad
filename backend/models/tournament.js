const User = require("./user");
const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = Tournament;
