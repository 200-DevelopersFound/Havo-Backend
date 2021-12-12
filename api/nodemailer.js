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
const sendMail = (email, otp, obj, callback) => {
  transporter.sendMail(
    {
      from: "200shreyans@gmail.com",
      to: email,
      subject: "Text-Email",
      text: "Your OTP is " + otp + "\n" + JSON.stringify(obj),
    },
    callback
  );
};

module.exports = sendMail;
