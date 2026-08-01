const Review = require('../models/Review');
const Hackathon = require('../models/Hackathon');
const Submission = require('../models/Submission');

// @desc    Submit evaluation for a submission
// @route   POST /api/reviews
// @access  Judge
exports.submitReview = async (req, res, next) => {
  try {
    const { submissionId, hackathonId, scores, comments } = req.body;

    // Check judge is assigned to this hackathon
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ success: false, message: 'Hackathon not found' });

    const isAssigned = hackathon.judges.map(j => j.toString()).includes(req.user._id.toString());
    if (!isAssigned && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not assigned as a judge for this hackathon' });
    }

    const existing = await Review.findOne({ submission: submissionId, judge: req.user._id });
    if (existing) {
      // Update existing review
      Object.assign(existing, { scores, comments });
      await existing.save();
      return res.status(200).json({ success: true, review: existing });
    }

    const review = await Review.create({
      submission: submissionId,
      judge: req.user._id,
      hackathon: hackathonId,
      scores,
      comments,
    });

    // Update submission status to under_review
    await Submission.findByIdAndUpdate(submissionId, { status: 'under_review' });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a submission
// @route   GET /api/reviews/submission/:submissionId
// @access  Organizer, Admin
exports.getSubmissionReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ submission: req.params.submissionId })
      .populate('judge', 'name email avatar');
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my review for a submission
// @route   GET /api/reviews/my/:submissionId
// @access  Judge
exports.getMyReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      submission: req.params.submissionId,
      judge: req.user._id,
    });
    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions assigned to judge for a hackathon
// @route   GET /api/reviews/assigned/:hackathonId
// @access  Judge
exports.getAssignedSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ hackathon: req.params.hackathonId })
      .populate('team', 'name members')
      .populate('hackathon', 'title');

    // Attach review status for this judge
    const submissionsWithStatus = await Promise.all(
      submissions.map(async (sub) => {
        const review = await Review.findOne({ submission: sub._id, judge: req.user._id });
        return { ...sub.toObject(), reviewed: !!review, review };
      })
    );

    res.status(200).json({ success: true, submissions: submissionsWithStatus });
  } catch (error) {
    next(error);
  }
};
