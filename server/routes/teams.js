const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createTeam, getMyTeam, getHackathonTeams, getTeamById,
  addMember, removeMember, transferLeadership, deleteTeam,
} = require('../controllers/teamController');

router.use(protect);

router.post('/', authorize('participant'), createTeam);
router.get('/my/:hackathonId', authorize('participant'), getMyTeam);
router.get('/hackathon/:hackathonId', authorize('organizer', 'admin'), getHackathonTeams);
router.get('/:id', getTeamById);
router.post('/:id/members', authorize('participant'), addMember);
router.delete('/:id/members/:memberId', authorize('participant'), removeMember);
router.put('/:id/transfer-leadership', authorize('participant'), transferLeadership);
router.delete('/:id', authorize('participant', 'admin'), deleteTeam);

module.exports = router;
