const mongoose = require("mongoose");

const blackestTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date().getTime() },
  updatedAt: { type: Date, required: true, default: new Date().getTime() },
});

module.exports = mongoose.model("blackestToken", blackestTokenSchema);
