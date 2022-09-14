const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name:String ,
  type:String ,
  level:String,
  credits:String,
  Faculty: [{type:String}],
});

module.exports = mongoose.model("courses", CourseSchema);
