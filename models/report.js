const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reportsSchema = new schema({
  reportURL: { type: String },
  reportGeneratedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  reportDateGeneratedAt: { type: Date, default: Date.now },
  reportSentDate: { type: Date },
  isSent: { type: Boolean, default: false },
});
module.exports = mongoose.model("Report", reportsSchema);
