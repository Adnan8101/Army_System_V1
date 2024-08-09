const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendApprovalEmail, sendRejectionEmail } = require('../utils/email');

const getPendingRegistrations = async (req, res) => {
    try {
        const users = await User.find({ status: 'Pending' });
        res.json(users);
    } catch (error) {
        console.error('Error fetching pending registrations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const approveUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const generatedPassword = Math.random().toString(36).slice(-8); // Generate a random password
        user.password = await bcrypt.hash(generatedPassword, 10);
        user.status = 'Approved';
        await user.save();
        // Send approval email to user
        await sendApprovalEmail(user.email, user.name, user.uid, generatedPassword);
        res.json({ message: 'User approved successfully' });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const rejectUser = async (req, res) => {
    try {
        const { userId, reason } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.status = 'Rejected';
        user.rejectionReason = reason;
        await user.save();
        // Send rejection email to user
        await sendRejectionEmail(user.email, user.name, reason);
        res.json({ message: 'User rejected successfully' });
    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getPendingRegistrations,
    approveUser,
    rejectUser
};
