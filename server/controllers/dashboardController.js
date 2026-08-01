const User = require('../models/User');
const Hackathon = require('../models/Hackathon');
const Team = require('../models/Team');
const Submission = require('../models/Submission');
const Registration = require('../models/Registration');
const Review = require('../models/Review');

// @desc    Admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalHackathons, totalTeams, totalSubmissions] = await Promise.all([
      User.countDocuments(),
      Hackathon.countDocuments(),
      Team.countDocuments(),
      Submission.countDocuments(),
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    const recentHackathons = await Hackathon.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt');

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalHackathons, totalTeams, totalSubmissions },
      usersByRole,
      recentUsers,
      recentHackathons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Organizer dashboard stats
// @route   GET /api/dashboard/organizer
// @access  Organizer
exports.getOrganizerStats = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find({ organizer: req.user._id });
    const hackathonIds = hackathons.map(h => h._id);

    const [totalRegistrations, totalTeams, totalSubmissions, pendingRegistrations] = await Promise.all([
      Registration.countDocuments({ hackathon: { $in: hackathonIds } }),
      Team.countDocuments({ hackathon: { $in: hackathonIds } }),
      Submission.countDocuments({ hackathon: { $in: hackathonIds } }),
      Registration.countDocuments({ hackathon: { $in: hackathonIds }, status: 'pending' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalHackathons: hackathons.length,
        totalRegistrations,
        totalTeams,
        totalSubmissions,
        pendingRegistrations,
      },
      hackathons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Participant dashboard stats
// @route   GET /api/dashboard/participant
// @access  Participant
exports.getParticipantStats = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ participant: req.user._id })
      .populate('hackathon', 'title status startDate endDate mode');

    const teams = await Team.find({ members: req.user._id })
      .populate('hackathon', 'title status');

    const hackathonIds = registrations.map(r => r.hackathon?._id).filter(Boolean);
    const submissions = await Submission.find({
      hackathon: { $in: hackathonIds },
      submittedBy: req.user._id,
    }).populate('hackathon', 'title');

    res.status(200).json({
      success: true,
      stats: {
        totalRegistrations: registrations.length,
        totalTeams: teams.length,
        totalSubmissions: submissions.length,
      },
      registrations,
      teams,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Judge dashboard stats
// @route   GET /api/dashboard/judge
// @access  Judge
exports.getJudgeStats = async (req, res, next) => {
  try {
    const assignedHackathons = await Hackathon.find({ judges: req.user._id })
      .select('title status startDate endDate');

    const hackathonIds = assignedHackathons.map(h => h._id);

    const [totalAssigned, completedReviews] = await Promise.all([
      Submission.countDocuments({ hackathon: { $in: hackathonIds } }),
      Review.countDocuments({ judge: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        assignedHackathons: assignedHackathons.length,
        totalAssigned,
        completedReviews,
        pendingReviews: totalAssigned - completedReviews,
      },
      assignedHackathons,
    });
  } catch (error) {
    next(error);
  }
};
