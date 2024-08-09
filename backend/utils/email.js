const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject("Failed to create access token :(");
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GMAIL_USER,
            accessToken,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN
        }
    });

    return transporter;
};

const sendEmail = async (emailOptions) => {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
};

const sendApprovalEmail = async (to, name, uniqueID, password) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: "Registration Approved",
        html: `<p>Hello ${name},</p>
               <p>Your registration has been approved. Here are your credentials:</p>
               <p>User ID: ${uniqueID}</p>
               <p>Password: ${password}</p>`
    };
    await sendEmail(mailOptions);
};

const sendRejectionEmail = async (to, name, reason) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: "Registration Rejected",
        html: `<p>Hello ${name},</p>
               <p>We regret to inform you that your registration has been rejected. Reason: ${reason}</p>`
    };
    await sendEmail(mailOptions);
};

const sendPasswordResetEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: "Password Reset OTP",
        html: `<p>Your OTP for password reset is: ${otp}</p>`
    };
    await sendEmail(mailOptions);
};

const sendPasswordChangedEmail = async (to, name) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: "Password Changed",
        html: `<p>Hello ${name},</p>
               <p>Your password has been successfully changed.</p>
               <p>If you did not initiate this change, please contact support immediately.</p>`
    };
    await sendEmail(mailOptions);
};

module.exports = {
    sendApprovalEmail,
    sendRejectionEmail,
    sendPasswordResetEmail,
    sendPasswordChangedEmail
};
