const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');

router.get('/:hackathonId', getLeaderboard);

module.exports = router;
