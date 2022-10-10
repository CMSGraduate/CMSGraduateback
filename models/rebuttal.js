const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const synopsisrebuttal = new Schema({
    student_id: { type: Schema.Types.ObjectId, ref: "Student" },
    session_id: { type: Schema.Types.ObjectId, ref: "Session" },
    program_id: { type: Schema.Types.ObjectId, ref: "Program" },
    supervisor_id: { type: Schema.Types.ObjectId, ref: "Faculty" },
    coSupervisor_id: { type: Schema.Types.ObjectId, ref: "Faculty" },
    synopsisTitle: { type: String },
    synopsisStatus: { type: String },
    specializationTrack: { type: String /*required: true */ },
    synopsisNotification: { type: String /* required: true */ },
    synopsisFileName: { type: String /* required: true */ },
    plagiarismReport: { type: String /* required: true */ },
    externalExaminer: { type: String /* required: true */ },
    synopsisPresentationFileName: { type: String /* required: true */ },
    synopsisFile:{type:String},
    creationDate: { type: Date, default: Date.now /* required: true */ },
    isActive: { type: Boolean, default: true /* required: true */ },
    ipAddress: { type: String /* required: true */ },
    status: { type: Boolean,default:false /* required: true */ },
    schedule_id:{type:mongoose.Types.ObjectId,ref:"SynopsisSchedule"},
    evaluation_id:{type:mongoose.Types.ObjectId,ref:"SynopsisEvaluation"},
    verified:{type:Boolean,default:false}
});

module.exports = mongoose.model("SynopsisRebuttal", synopsisrebuttal);
