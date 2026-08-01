const Team = require('../models/Team');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');

// @desc    Create team
// @route   POST /api/teams
// @access  Participant
exports.createTeam = async (req, res, next) => {
  try {
    const { name, hackathonId } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ success: false, message: 'Hackathon not found' });

    // Check if user already has a team for this hackathon
    const existingTeam = await Team.findOne({
      hackathon: hackathonId,
      members: req.user._id,
    });
    if (existingTeam) {
      return res.status(400).json({ success: false, message: 'You already have a team for this hackathon' });
    }

    const team = await Team.create({
      name,
      hackathon: hackathonId,
      leader: req.user._id,
      members: [req.user._id],
    });

    const populated = await team.populate([
      { path: 'members', select: 'name email avatar' },
      { path: 'leader', select: 'name email avatar' },
      { path: 'hackathon', select: 'title maxTeamSize' },
    ]);

    res.status(201).json({ success: true, team: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team by hackathon (my team)
// @route   GET /api/teams/my/:hackathonId
// @access  Participant
exports.getMyTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      hackathon: req.params.hackathonId,
      members: req.user._id,
    })
      .populate('members', 'name email avatar')
      .populate('leader', 'name email avatar')
      .populate('hackathon', 'title maxTeamSize');

    res.status(200).json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams for a hackathon
// @route   GET /api/teams/hackathon/:hackathonId
// @access  Organizer/Admin
exports.getHackathonTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ hackathon: req.params.hackathonId })
      .populate('members', 'name email avatar')
      .populate('leader', 'name email avatar');

    res.status(200).json({ success: true, teams });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private
exports.getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email avatar')
      .populate('hackathon', 'title maxTeamSize');

    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.status(200).json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to team by email
// @route   POST /api/teams/:id/members
// @access  Team Leader
exports.addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const team = await Team.findById(req.params.id).populate('hackathon', 'maxTeamSize');
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only team leader can add members' });
    }

    if (team.members.length >= team.hackathon.maxTeamSize) {
      return res.status(400).json({ success: false, message: 'Team is full' });
    }

    const newMember = await User.findOne({ email });
    if (!newMember) return res.status(404).json({ success: false, message: 'User not found with that email' });

    if (team.members.map(m => m.toString()).includes(newMember._id.toString())) {
      return res.status(400).json({ success: false, message: 'User is already in the team' });
    }

    team.members.push(newMember._id);
    await team.save();

    const updated = await Team.findById(team._id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email avatar');

    res.status(200).json({ success: true, team: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:memberId
// @access  Team Leader
exports.removeMember = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only team leader can remove members' });
    }

    if (req.params.memberId === team.leader.toString()) {
      return res.status(400).json({ success: false, message: 'Leader cannot remove themselves. Transfer leadership first.' });
    }

    team.members = team.members.filter(m => m.toString() !== req.params.memberId);
    await team.save();

    const updated = await Team.findById(team._id).populate('members', 'name email avatar');
    res.status(200).json({ success: true, team: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Transfer leadership
// @route   PUT /api/teams/:id/transfer-leadership
// @access  Team Leader
exports.transferLeadership = async (req, res, next) => {
  try {
    const { newLeaderId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only current leader can transfer leadership' });
    }

    if (!team.members.map(m => m.toString()).includes(newLeaderId)) {
      return res.status(400).json({ success: false, message: 'New leader must be a team member' });
    }

    team.leader = newLeaderId;
    await team.save();

    const updated = await Team.findById(team._id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email avatar');

    res.status(200).json({ success: true, team: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Team Leader
exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    if (team.leader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await team.deleteOne();
    res.status(200).json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    next(error);
  }
};
