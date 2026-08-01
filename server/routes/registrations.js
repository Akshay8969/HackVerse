const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  register, cancelRegistration, getHackathonRegistrations,
  updateRegistrationStatus, getMyRegistrations, checkRegistration,
} = require('../controllers/registrationController');

router.use(protect);

router.post('/', authorize('participant'), register);
router.get('/my', authorize('participant'), getMyRegistrations);
router.get('/check/:hackathonId', checkRegistration);
router.get('/hackathon/:hackathonId', authorize('organizer', 'admin'), getHackathonRegistrations);
router.put('/:id/status', authorize('organizer', 'admin'), updateRegistrationStatus);
router.delete('/:id', authorize('participant'), cancelRegistration);

module.exports = router;
