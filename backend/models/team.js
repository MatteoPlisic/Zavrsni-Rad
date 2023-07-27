const mongoose = require("mongoose")
const teamSchema = new mongoose.Schema({
    team1:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Team',
        required:true,
    },
    team1:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Team',
        required:true,
    },
    
    
  });

  const Team = mongoose.model('Team', teamSchema);

  module.exports = Team;