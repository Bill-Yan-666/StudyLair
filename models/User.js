const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: 
  {
    type: String,
    required: true
  },
  gender:
  {
    type: String,
  },
  major:
  {
    type: String,
  },
  gradYear:
  {
    type: Number,
  },
  email: 
  {
    type: String,
    required: true
  },
  photo:
  {
    type: String,
  },
  password: 
  {
    type: String,
    required: true
  },
  date: 
  {
    type: Date,
    default: Date.now
  },
  classList: 
  {
    type: [[String]],
    default: [["c1", "a1"], ["c2", "a2"]]
  },
  availability:
  {
    type: [{ day: String, start: Number, end: Number,}],
  },
});

module.exports = User = mongoose.model("users", UserSchema);
