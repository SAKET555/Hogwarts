const express = require('express');
const router = express.Router();
const { protect } = require('../utils/authMiddleware');
const User = require('../models/User');

// Get all users except the current user (for private chat)
router.get('/users', protect, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('name email house wand');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
