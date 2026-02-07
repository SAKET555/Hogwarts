const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../utils/authMiddleware');

router.route('/:roomId').get(protect, getMessages);
router.route('/').post(protect, sendMessage);

module.exports = router;
