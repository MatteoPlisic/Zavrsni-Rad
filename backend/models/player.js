const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:Date

    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team', // Reference the 'Team' model
        required: true,
      },

});

playerSchema.virtual('team1Name', {
    ref: 'Team', // Reference the 'Team' model
    localField: 'team',
    foreignField: '_id',
    justOne: true,
  });
  
  playerSchema.set('toJSON', { virtuals: true });

  const Player = mongoose.model('Player',playerSchema);

  module.exports =  Player;