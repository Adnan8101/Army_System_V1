const User = require('../models/User');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');

const approveUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.status = 'approved';
        const password = Math.random().toString(36).slice(-8);  // Generate a random password
        user.password = await bcrypt.hash(password, 10);  // Hash the password
        await user.save();

        // Send approval email to user with the new password
        await sendEmail({
            to: user.email,
            subject: 'Registration Approved',
            html: `
                <h1>Registration Approved</h1>
                <p>Your registration has been approved. Here are your credentials:</p>
                <p><strong>User ID:</strong> ${user.uid}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>You can now login with your credentials.</p>
            `
        });

        res.json({ message: 'User approved successfully' });
    } catch (error) {
        console.error('Approval error:', error);
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
        user.status = 'rejected';
        user.rejectionReason = reason;
        await user.save();

        // Send rejection email to user
        await sendEmail({
            to: user.email,
            subject: 'Registration Rejected',
            html: `
                <h1>Registration Rejected</h1>
                <p>We regret to inform you that your registration has been rejected. Reason: ${reason}</p>
            `
        });

        res.json({ message: 'User rejected successfully' });
    } catch (error) {
        console.error('Rejection error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    approveUser,
    rejectUser
};
