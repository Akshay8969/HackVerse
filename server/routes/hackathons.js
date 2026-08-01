const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');
const {
  getHackathons, getHackathon, createHackathon, updateHackathon,
  deleteHackathon, toggleRegistration, assignJudges, getMyHackathons, announceWinners,
} = require('../controllers/hackathonController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Public
router.get('/', getHackathons);
router.get('/my', protect, authorize('organizer', 'admin'), getMyHackathons);
router.get('/:id', getHackathon);

// Organizer
router.post('/', protect, authorize('organizer', 'admin'), upload.single('bannerImage'), createHackathon);
router.put('/:id', protect, authorize('organizer', 'admin'), upload.single('bannerImage'), updateHackathon);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteHackathon);
router.put('/:id/registration', protect, authorize('organizer', 'admin'), toggleRegistration);
router.put('/:id/judges', protect, authorize('organizer', 'admin'), assignJudges);
router.put('/:id/announce-winners', protect, authorize('organizer', 'admin'), announceWinners);

module.exports = router;
