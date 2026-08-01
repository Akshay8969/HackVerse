const Registration = require('../models/Registration');
const Hackathon = require('../models/Hackathon');

// @desc    Register for hackathon
// @route   POST /api/registrations
// @access  Participant
exports.register = async (req, res, next) => {
  try {
    const { hackathonId } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ success: false, message: 'Hackathon not found' });

    if (!hackathon.registrationOpen) {
      return res.status(400).json({ success: false, message: 'Registration is closed for this hackathon' });
    }

    const existing = await Registration.findOne({
      hackathon: hackathonId,
      participant: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already registered for this hackathon' });
    }

    const registration = await Registration.create({
      hackathon: hackathonId,
      participant: req.user._id,
    });

    res.status(201).json({ success: true, registration });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Participant
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

    if (registration.participant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await registration.deleteOne();
    res.status(200).json({ success: true, message: 'Registration cancelled' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registrations for a hackathon (Organizer)
// @route   GET /api/registrations/hackathon/:hackathonId
// @access  Organizer
exports.getHackathonRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ hackathon: req.params.hackathonId })
      .populate('participant', 'name email avatar')
      .populate('team', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, registrations });
  } catch (error) {
    next(error);
  }
};

// @desc    Update registration status (approve/reject)
// @route   PUT /api/registrations/:id/status
// @access  Organizer
exports.updateRegistrationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('participant', 'name email');

    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

    res.status(200).json({ success: true, registration });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Participant
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ participant: req.user._id })
      .populate('hackathon', 'title bannerImage startDate endDate status mode')
      .populate('team', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, registrations });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user is registered for a hackathon
// @route   GET /api/registrations/check/:hackathonId
// @access  Private
exports.checkRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      hackathon: req.params.hackathonId,
      participant: req.user._id,
    });
    res.status(200).json({ success: true, isRegistered: !!registration, registration });
  } catch (error) {
    next(error);
  }
};
