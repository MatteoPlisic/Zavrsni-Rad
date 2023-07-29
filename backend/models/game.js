const mongoose = require("mongoose")
const gameSchema = new mongoose.Schema({
    team1:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Team',
        required:true,
    },
    team2:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Team',
        required:true,
    },
    roundOf:{
        type:BigInt,

    },
    team1Score:{
        type:BigInt,
    },
    team2Score:{
        type:BigInt,
    },
    tournament:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tournament',
        required:true,
    }
    
  });

  const Team = mongoose.model('Game', gameSchema);

  module.exports = Team;