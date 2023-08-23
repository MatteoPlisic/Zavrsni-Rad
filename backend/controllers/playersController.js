const Player = require("../models/player");

// Create a new player
async function createPlayer(req, res) {
  try {
    const { name, dateOfBirth, team } = req.body;
    console.log(dateOfBirth)
    const player = new Player({ name, dateOfBirth, team });
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Get all players
async function getAllPlayers(req, res) {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    console.error('Error getting players:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Get a single player by ID
async function getPlayerById(req, res) {
  try {
    const playerId = req.params.id;
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    console.error('Error getting player:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Update a player by ID
async function updatePlayer(req, res) {
  try {
    const playerId = req.params.id;
    const { name, dateOfBirth, team } = req.body;
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    player.name = name;
    player.dateOfBirth = dateOfBirth;
    player.team = team;
    await player.save();
    res.json(player);
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Delete a player by ID
async function deletePlayer(req, res) {
  try {
    const playerId = req.params.id;
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    await player.deleteOne();
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
};
