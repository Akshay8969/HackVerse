const Review = require('../models/Review');
const Submission = require('../models/Submission');
const Team = require('../models/Team');

// @desc    Get leaderboard for a hackathon
// @route   GET /api/leaderboard/:hackathonId
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  try {
    // Aggregate reviews grouped by submission
    const leaderboard = await Review.aggregate([
      { $match: { hackathon: require('mongoose').Types.ObjectId.createFromHexString(req.params.hackathonId) } },
      {
        $group: {
          _id: '$submission',
          avgScore: { $avg: '$totalScore' },
          totalReviews: { $sum: 1 },
          maxScore: { $max: '$totalScore' },
        },
      },
      { $sort: { avgScore: -1 } },
    ]);

    // Populate submission & team details
    const populated = await Promise.all(
      leaderboard.map(async (entry, idx) => {
        const submission = await Submission.findById(entry._id)
          .populate('team', 'name leader members')
          .populate('submittedBy', 'name');

        return {
          rank: idx + 1,
          submission,
          avgScore: Math.round(entry.avgScore * 100) / 100,
          totalReviews: entry.totalReviews,
          maxScore: entry.maxScore,
        };
      })
    );

    res.status(200).json({ success: true, leaderboard: populated });
  } catch (error) {
    next(error);
  }
};
