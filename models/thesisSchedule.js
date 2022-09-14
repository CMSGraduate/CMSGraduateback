const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const thesisScheduleSchema = new Schema({
  student_id: { type: mongoose.Types.ObjectId, ref: "Student" },
  session_id: { type: mongoose.Types.ObjectId, ref: "Session" },
  program_id: { type: mongoose.Types.ObjectId, ref: "Program" },
  defenseDate: { type: Date, default: Date.now /* required: true */ },
  /*  reportURL: { type: String },
  reportGeneratedBy: { type: mongoose.Types.ObjectId, ref: "User" }, */
  creationDate: { type: Date /* required: true */ },
  scheduledBy: { type: mongoose.Types.ObjectId, ref: "User" },
  IP: { type: String /* required: true */ },
  isActive: { type: Boolean, default: true /* required: true */ },
  /* reportDate: { type: Date },
  reportSentDate: { type: Date }, */
});

module.exports = mongoose.model("ThesisSchedule", thesisScheduleSchema);
