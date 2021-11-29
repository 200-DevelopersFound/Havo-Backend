const mongoose = require("mongoose");

const userLoginsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  loggedOut: { type: Boolean, default: false },
  loggedInAt: { type: Date, default: new Date().getTime() },
  loggedOutAt: { type: Date, default: new Date().getTime() },
  ipAddress: { type: String, required: true },
  tokenId: { type: String, unique: true },
  tokenSecret: { type: String },
  tokenDeleted: { type: Boolean, default: false },
  device: { type: String },
});

module.exports = mongoose.model("userLogins", userLoginsSchema);
