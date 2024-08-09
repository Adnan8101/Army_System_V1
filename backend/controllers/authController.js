const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendApprovalEmail } = require('../utils/email');
const { generateUniqueID } = require('../utils/helpers'); // Import generateUniqueID

const registerUser = async (req, res) => {
    try {
        const { name, email, userType, licenseNumber, phoneNumber } = req.body;

        console.log('Registering user:', { name, email, userType, licenseNumber, phoneNumber });

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            userType,
            licenseNumber,
            phoneNumber,
            uid: generateUniqueID(userType),
            status: 'Pending'
        });

        await user.save();

        console.log('Created user object:', user);

        sendApprovalEmail(user.email, user.name, user.uid)
            .then(() => {
                res.status(200).json({ msg: 'User registration submitted for approval' });
            })
            .catch(error => {
                console.error('Error sending approval email:', error);
                res.status(500).json({ msg: 'Error sending approval email' });
            });

    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req, res) => {
    const { loginType, loginInput, password } = req.body;
    try {
        let user;
        if (loginType === 'email') {
            user = await User.findOne({ email: loginInput });
        } else {
            user = await User.findOne({ uid: loginInput });
        }

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Expected password: ${user.password}, Typed password: ${password}, Is match: ${isMatch}`);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, name: user.name, userType: user.userType });
            }
        );
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Server error');
    }
};

const checkUID = async (req, res) => {
    const { uid } = req.body;
    try {
        let user = await User.findOne({ uid });
        if (!user) {
            return res.status(400).json({ msg: 'UID does not exist' });
        }
        res.json({ msg: 'UID exists', user });
    } catch (err) {
        console.error('Check UID error:', err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    registerUser,
    loginUser,
    checkUID
};
