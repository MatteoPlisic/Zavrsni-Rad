const mongoose = require("mongoose")
const tournamentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
  });

  const Tournament = mongoose.model('Tournament', tournamentSchema);

  module.exports = Tournament;