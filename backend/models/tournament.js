const User = require("./user");
const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  date:{
    type:Date,
    require:true
  },
  location: {
    type:String
  },
  format: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teams: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Team',
    required:true,
  },
  isDone: {
    type:Boolean,
    required:true,
    default:false
  }
});

const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = Tournament;
