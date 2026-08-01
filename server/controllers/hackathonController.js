const Hackathon = require('../models/Hackathon');

// @desc    Get all hackathons with search & filter
// @route   GET /api/hackathons
// @access  Public
exports.getHackathons = async (req, res, next) => {
  try {
    const { search, mode, status, theme, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { theme: { $regex: search, $options: 'i' } },
      ];
    }
    if (mode) filter.mode = mode;
    if (status) filter.status = status;
    if (theme) filter.theme = { $regex: theme, $options: 'i' };

    const total = await Hackathon.countDocuments(filter);
    const hackathons = await Hackathon.find(filter)
      .populate('organizer', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, hackathons });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hackathon
// @route   GET /api/hackathons/:id
// @access  Public
exports.getHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('organizer', 'name email avatar')
      .populate('judges', 'name email avatar');

    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }
    res.status(200).json({ success: true, hackathon });
  } catch (error) {
    next(error);
  }
};

// @desc    Create hackathon
// @route   POST /api/hackathons
// @access  Organizer
exports.createHackathon = async (req, res, next) => {
  try {
    const data = { ...req.body, organizer: req.user._id };
    if (req.file) data.bannerImage = `/uploads/${req.file.filename}`;

    const hackathon = await Hackathon.create(data);
    res.status(201).json({ success: true, hackathon });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hackathon
// @route   PUT /api/hackathons/:id
// @access  Organizer (own) / Admin
exports.updateHackathon = async (req, res, next) => {
  try {
    let hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Only organizer or admin
    if (
      hackathon.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updateData = { ...req.body };
    if (req.file) updateData.bannerImage = `/uploads/${req.file.filename}`;

    hackathon = await Hackathon.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, hackathon });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hackathon
// @route   DELETE /api/hackathons/:id
// @access  Organizer (own) / Admin
exports.deleteHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    if (
      hackathon.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await hackathon.deleteOne();
    res.status(200).json({ success: true, message: 'Hackathon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Open/Close registration
// @route   PUT /api/hackathons/:id/registration
// @access  Organizer
exports.toggleRegistration = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ success: false, message: 'Hackathon not found' });

    if (hackathon.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    hackathon.registrationOpen = !hackathon.registrationOpen;
    hackathon.status = hackathon.registrationOpen ? 'Registration Open' : 'Registration Closed';
    await hackathon.save();

    res.status(200).json({ success: true, hackathon });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign judges to hackathon
// @route   PUT /api/hackathons/:id/judges
// @access  Organizer
exports.assignJudges = async (req, res, next) => {
  try {
    const { judgeIds } = req.body;
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ success: false, message: 'Hackathon not found' });

    if (hackathon.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    hackathon.judges = judgeIds;
    await hackathon.save();

    res.status(200).json({ success: true, hackathon });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organizer's hackathons
// @route   GET /api/hackathons/my
// @access  Organizer
exports.getMyHackathons = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, hackathons });
  } catch (error) {
    next(error);
  }
};

// @desc    Announce winners
// @route   PUT /api/hackathons/:id/announce-winners
// @access  Organizer
exports.announceWinners = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ success: false, message: 'Hackathon not found' });

    if (hackathon.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    hackathon.winnersAnnounced = true;
    hackathon.status = 'Completed';
    await hackathon.save();

    res.status(200).json({ success: true, message: 'Winners announced!', hackathon });
  } catch (error) {
    next(error);
  }
};
