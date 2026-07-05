const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    data: mongoose.Schema.Types.Mixed,
    generatedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);