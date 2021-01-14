const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CourseSchema = new Schema({
    // Name of the course
    name: 
    {
      type: String,
    },

    // Instructor of the course
    prof: 
    {
      type: String,
    },

    // List of students in the course, by the id stored in database
    students: 
    {
      type: [String]
    },

    // Number of students in the course
    counter: 
    {
      type: Number,
    }
  });
  
  module.exports = Course = mongoose.model("courses", CourseSchema);
  