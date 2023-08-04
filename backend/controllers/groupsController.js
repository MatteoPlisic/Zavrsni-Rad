const Group = require("../models/group");

// Create a new group
async function createGroup(req, res) {
  try {
    const { tournament, teams, teamScores } = req.body;

    console.log('Received request body:', req.body);

    const group = new Group({ tournament, teams, teamScores });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


// Get all groups
async function getAllGroups(req, res) {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    console.error('Error getting groups:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Get a single group by ID
async function getGroupById(req, res) {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId).populate('teams teamScores.team');
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    console.error('Error getting group:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
async function updateGroup(req, res) {
  try {
    const groupId = req.params.id;
    const { tournament, teams, teamScores } = req.body;
    
    // Optional: You can add additional validation here if needed, such as checking if the group exists

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Update the group fields
    group.tournament = tournament;
    group.teams = teams;
    group.teamScores = teamScores;

    // Save the updated group
    await group.save();
    res.json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function finishGroup(req,res){
  try {
    const groupId = req.params.id;
    
    
    // Optional: You can add additional validation here if needed, such as checking if the group exists

    const group = await Group.findById(groupId);
    group.isFinished = true
    await group.save()
    res.json(group)
  } catch (error) {
    console.log(error)
    res.status(500).json({error:'Server error'})
  }
}

// Delete a group by ID
async function deleteGroup(req, res) {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    await group.deleteOne();
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  finishGroup
};
