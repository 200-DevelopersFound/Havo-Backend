const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date().getTime() },
  updatedAt: { type: Date, required: true, default: new Date().getTime() },
});

module.exports = mongoose.model("BlacklistToken", blacklistTokenSchema);
