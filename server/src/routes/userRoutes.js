const express = require('express');
const router = express.Router();
const { getProfile, updateHouse, updateWand, deleteAccount } = require('../controllers/userController');
const { protect } = require('../utils/authMiddleware');

router.route('/profile')
    .get(protect, getProfile);

router.route('/house')
    .put(protect, updateHouse);

router.route('/wand')
    .put(protect, updateWand);

router.route('/delete')
    .delete(protect, deleteAccount);

module.exports = router;
