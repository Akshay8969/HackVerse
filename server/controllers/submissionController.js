const Submission = require('../models/Submission');
const Hackathon = require('../models/Hackathon');
const Team = require('../models/Team');

// @desc    Submit project
// @route   POST /api/submissions
// @access  Participant
exports.createSubmission = async (req, res, next) => {
  try {
    const { hackathonId, teamId, ...rest } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ success: false, message: 'Hackathon not found' });

    // Check deadline
    if (new Date() > new Date(hackathon.endDate)) {
      return res.status(400).json({ success: false, message: 'Submission deadline has passed' });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const existing = await Submission.findOne({ team: teamId, hackathon: hackathonId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Team has already submitted a project' });
    }

    const data = { ...rest, hackathon: hackathonId, team: teamId, submittedBy: req.user._id };

    // Handle uploaded files
    if (req.files) {
      if (req.files['screenshots']) {
        data.screenshots = req.files['screenshots'].map(f => `/uploads/${f.filename}`);
      }
      if (req.files['presentationPdf'] && req.files['presentationPdf'][0]) {
        data.presentationPdf = `/uploads/${req.files['presentationPdf'][0].filename}`;
      }
    }

    const submission = await Submission.create(data);
    res.status(201).json({ success: true, submission });
  } catch (error) {
    next(error);
  }
};

// @desc    Update submission (before deadline)
// @route   PUT /api/submissions/:id
// @access  Participant (team leader)
exports.updateSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('hackathon');
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    if (new Date() > new Date(submission.hackathon.endDate)) {
      return res.status(400).json({ success: false, message: 'Cannot update after deadline' });
    }

    if (submission.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updateData = { ...req.body };
    if (req.files) {
      if (req.files['screenshots']) {
        updateData.screenshots = req.files['screenshots'].map(f => `/uploads/${f.filename}`);
      }
      if (req.files['presentationPdf'] && req.files['presentationPdf'][0]) {
        updateData.presentationPdf = `/uploads/${req.files['presentationPdf'][0].filename}`;
      }
    }

    const updated = await Submission.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ success: true, submission: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for a hackathon
// @route   GET /api/submissions/hackathon/:hackathonId
// @access  Organizer, Admin, Judge
exports.getHackathonSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ hackathon: req.params.hackathonId })
      .populate('team', 'name leader members')
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my team's submission for a hackathon
// @route   GET /api/submissions/my/:hackathonId
// @access  Participant
exports.getMySubmission = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      hackathon: req.params.hackathonId,
      members: req.user._id,
    });

    if (!team) return res.status(200).json({ success: true, submission: null });

    const submission = await Submission.findOne({
      hackathon: req.params.hackathonId,
      team: team._id,
    }).populate('team', 'name');

    res.status(200).json({ success: true, submission });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private
exports.getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('team', 'name members leader')
      .populate('submittedBy', 'name email')
      .populate('hackathon', 'title');

    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    res.status(200).json({ success: true, submission });
  } catch (error) {
    next(error);
  }
};

// @desc    Update submission status
// @route   PUT /api/submissions/:id/status
// @access  Organizer
exports.updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    res.status(200).json({ success: true, submission });
  } catch (error) {
    next(error);
  }
};
