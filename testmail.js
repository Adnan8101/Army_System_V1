require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const readlineSync = require('readline-sync');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    access_token: process.env.GMAIL_ACCESS_TOKEN // Added this line
});

async function sendMail(to) {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: to,
            subject: 'Test Email',
            text: 'Hello'
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent:', result);
    } catch (error) {
        console.error('Failed to send email:', error.message);
    }
}

const toEmail = readlineSync.question('Enter the email address to send the test email to: ');
sendMail(toEmail);
