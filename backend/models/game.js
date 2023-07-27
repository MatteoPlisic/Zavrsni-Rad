const mongoose = require("mongoose")
const gameSchema = new mongoose.Schema({
    team1:{
        type:String,
        required:true,
    },
    
    
  });

  const Team = mongoose.model('Game', gameSchema);

  module.exports = Team;