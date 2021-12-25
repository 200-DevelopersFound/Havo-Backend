const mongoose = require("mongoose");
const { validateEmail, reg } = require("../util/validateEmail");

const otpSchema = new mongoose.Schema({
  createdAt: { type: Date, default: new Date().getTime() },
  expirationTime: { type: Date, default: new Date().getTime() + 1000000 },
  otp: { type: String },
  verified: { type: Boolean, default: false },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    // validate: [validateEmail, "Please fill a valid email address"],
    match: [reg, "Please fill a valid email address"],
  },
});

module.exports = mongoose.model("otp", otpSchema);
