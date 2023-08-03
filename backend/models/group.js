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

// Define the 'teamInfo' virtual field
groupSchema.virtual('teamInfo', {
  ref: 'Team', // The model to use for populating the virtual field
  localField: 'teamScores.team',
  foreignField: '_id',
  justOne: false, // Set to 'false' to get an array of team objects
});

// Auto-populate the 'teamInfo' virtual field when querying for groups
groupSchema.set('toObject', { virtuals: true });
groupSchema.set('toJSON', { virtuals: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
