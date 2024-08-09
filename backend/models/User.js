const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userType: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        default: 'Pending',
    },
    password: {
        type: String,
    },
    otp: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
