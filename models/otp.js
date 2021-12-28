const mongoose = require("mongoose");
const validateEmail = require("../util/validateEmail");

const otpSchema = new mongoose.Schema({
  createdAt: { type: Date, default: new Date().getTime() },
  expirationTime: { type: Date, default: new Date().getTime() + 172800000 },
  otp: { type: String },
  verified: { type: Boolean, default: false },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    validate: [validateEmail, "Please fill a valid email address"],
  },
});

module.exports = mongoose.model("Otp", otpSchema);
