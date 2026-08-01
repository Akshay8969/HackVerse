const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');
const {
  createSubmission, updateSubmission, getHackathonSubmissions,
  getMySubmission, getSubmissionById, updateSubmissionStatus,
} = require('../controllers/submissionController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const fileUpload = upload.fields([
  { name: 'screenshots', maxCount: 5 },
  { name: 'presentationPdf', maxCount: 1 },
]);

router.use(protect);

router.post('/', authorize('participant'), fileUpload, createSubmission);
router.get('/my/:hackathonId', authorize('participant'), getMySubmission);
router.get('/hackathon/:hackathonId', authorize('organizer', 'admin', 'judge'), getHackathonSubmissions);
router.get('/:id', getSubmissionById);
router.put('/:id', authorize('participant'), fileUpload, updateSubmission);
router.put('/:id/status', authorize('organizer', 'admin'), updateSubmissionStatus);

module.exports = router;
