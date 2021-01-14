const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vectorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
  graduationYear: {
    type: Number,
    required: true,
  },
  dayPref: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  courseList: {
    type: String,
    required: true,
  },
});

module.exports = TrainingData = mongoose.model("vectors", vectorSchema);
