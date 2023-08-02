const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
  ],
  teamScores: [
    {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
      goalsScored: {
        type: Number,
        default: 0,
      },
      points: {
        type: Number,
        default: 0,
      },
    },
  ],
});



const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
