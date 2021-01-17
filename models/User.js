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
  bio:
  {
      type: String,
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
    type: [{
        class_name: String,
        buddy_list: [{buddy_id: String, status: Boolean}],
        unlike_list: [{unlike_id: String, status: Boolean}],    
    }],
  },
  availability:
  {
    type: [{ day: String, start: Number, end: Number,}],
  },
});

module.exports = User = mongoose.model("users", UserSchema);
