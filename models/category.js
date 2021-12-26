const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  dialogues: { type: [{ type: String }], default: [] },
});

module.exports = mongoose.model("Category", categorySchema);
