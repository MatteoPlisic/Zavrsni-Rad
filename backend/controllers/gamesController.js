const Game = require('../models/game');
const Group = require('../models/group')
// Create a new game
async function createGame(req, res) {
  try {
    const newGame = new Game(req.body);
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    res.status(500).json({ error: 'Error creating the game' });
  }
}

// Get all games
async function getAllGames(req, res) {
  try {
    const games = await Game.find().populate('team1 team2');
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the games' });
  }
}

// Get a single game by ID
async function getGameById(req, res) {
  try {
   const game = await Game.findById(req.params.id)
  .populate('team1') // Populate the 'team1' field
  .populate('team2') // Populate the 'team2' field
  .exec();
    console.log(game)
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the game' });
  }
}

// Update a game by ID
async function updateGameById(req, res) {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('team1 team2');
    if (!updatedGame) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const { team1Score, team2Score, team1, team2 } = updatedGame;
    let team1Points = 0;
    let team2Points = 0;

    if (team1Score > team2Score) {
      team1Points = 3;
    } else if (team2Score > team1Score) {
      team2Points = 3;
    } else {
      // Draw - Both teams get 1 point
      team1Points = 1;
      team2Points = 1;
    }

    const group = await Group.findById(updatedGame.group);
    if (!group) {
      return res.status(404).json({ error: 'Group not found for the game' });
    }

    for (const teamScore of group.teamScores) {
        if (teamScore.team.equals(updatedGame.team1._id)) {
          teamScore.points += team1Points;
          teamScore.goalsScored = team1Score - team2Score
        } else if (teamScore.team.equals(updatedGame.team2._id)) {
          teamScore.points += team2Points;
          teamScore.goalsScored = team2Score - team1Score
        }
      }
    //group.teamScores[team1Index].points += team1Points;
    //group.teamScores[team2Index].points += team2Points;

    // Save the updated group
    await group.save();

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the game' });
  }
}

// Delete a game by ID
async function deleteGameById(req, res) {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the game' });
  }
}

module.exports = {
  createGame,
  getAllGames,
  getGameById,
  updateGameById,
  deleteGameById,
};
