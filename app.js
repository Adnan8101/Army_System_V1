const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./backend/routes/userRoutes');
const orderRoutes = require('./backend/routes/orderRoutes');
const passwordRoutes = require('./backend/routes/passwordRoutes');
const quotationRoutes = require('./backend/routes/quotationRoutes');
const officerRoutes = require('./backend/routes/officerRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Routes
app.use('/api', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/officer', officerRoutes);

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'pages', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'pages', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'pages', 'register.html'));
});

app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'pages', 'forgot-password.html'));
});

app.get('/otp-verification', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'pages', 'otp-verification.html'));
});

app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'pages', 'reset-password.html'));
});

// Panels
app.get('/panels/officer', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'panels', 'officer.html'));
});

app.get('/panels/agency', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'panels', 'agency.html'));
});

app.get('/panels/weapon_manufacturer', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'panels', 'weapon_manufacturer.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
