const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get pending registrations
const getPendingRegistrations = async (req, res) => {
    try {
        const users = await User.find({ status: 'Pending' });
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getPendingRegistrations
};
