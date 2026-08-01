const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  submitReview, getSubmissionReviews, getMyReview, getAssignedSubmissions,
} = require('../controllers/reviewController');

router.use(protect);

router.post('/', authorize('judge', 'admin'), submitReview);
router.get('/assigned/:hackathonId', authorize('judge', 'admin'), getAssignedSubmissions);
router.get('/my/:submissionId', authorize('judge'), getMyReview);
router.get('/submission/:submissionId', authorize('organizer', 'admin'), getSubmissionReviews);

module.exports = router;
