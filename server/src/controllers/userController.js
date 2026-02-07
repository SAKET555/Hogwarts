const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update house
const updateHouse = async (req, res) => {
    try {
        const { house } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { house },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update wand
const updateWand = async (req, res) => {
    try {
        const { wand } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { wand },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete account
const deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateHouse,
    updateWand,
    deleteAccount,
};
