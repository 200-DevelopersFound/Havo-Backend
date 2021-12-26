require("dotenv").config();
const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});
const sendMail = (email, otp, callback) => {
  transporter.sendMail(
    {
      from: "200shreyans@gmail.com",
      to: email,
      subject: "Email Verify OTP",
      text: "Your OTP is " + otp,
    },
    callback
  );
};

const sendPasswordResetLink = (email, token, callback) => {
  transporter.sendMail(
    {
      from: "200shreyans@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: "Your Password reset link is " + token,
    },
    callback
  );
};

module.exports = { sendMail, sendPasswordResetLink };
