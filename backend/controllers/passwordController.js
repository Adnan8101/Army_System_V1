const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateOTP } = require('../utils/helpers');
const { sendPasswordResetEmail, sendPasswordChangedEmail } = require('../utils/email');

const forgotPassword = async (req, res) => {
    try {
        const { email, uid } = req.body;
        const user = await User.findOne({ email, uid });
        if (!user) {
            return res.status(404).json({ error: 'User not found with the provided email and UID' });
        }
        const otp = generateOTP();
        user.otp = otp;
        await user.save();
        await sendPasswordResetEmail(user.email, otp);
        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User.findOne({ uid: userId });
        if (!user || user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP or user details' });
        }
        res.json({ message: 'OTP verified' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, uid, newPassword } = req.body;
        const user = await User.findOne({ email, uid });
        if (!user) {
            return res.status(404).json({ error: 'User not found with the provided email and UID' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null; // Clear OTP after successful reset
        await user.save();
        await sendPasswordChangedEmail(user.email, user.name); // Send password changed email
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    forgotPassword,
    verifyOTP,
    resetPassword
};
