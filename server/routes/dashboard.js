const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAdminStats, getOrganizerStats, getParticipantStats, getJudgeStats,
} = require('../controllers/dashboardController');

router.get('/admin', protect, authorize('admin'), getAdminStats);
router.get('/organizer', protect, authorize('organizer', 'admin'), getOrganizerStats);
router.get('/participant', protect, authorize('participant'), getParticipantStats);
router.get('/judge', protect, authorize('judge', 'admin'), getJudgeStats);

module.exports = router;
