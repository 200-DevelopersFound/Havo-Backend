const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    createdAt: { type: Date, default: new Date().getTime() },
    expirationTime : {type: Date, default: new Date().getTime() + 180000},
    otp: {type: String},
    verified: {type: Boolean, default: false}
});

module.exports = mongoose.model("otp", otpSchema);
