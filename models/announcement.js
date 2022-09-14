const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
  announcement: { type: String /*  required: true  */ },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  creationDate: { type: Date, default: Date.now /*  required: true  */ },
  isActive: { type: Boolean, default: true /*  required: true  */ },
  isRead: { type: Boolean },
});
module.exports = mongoose.model("Announcement", announcementSchema);
