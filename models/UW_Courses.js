const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CourseSchema = new Schema({
    // Name of the course
    course_u_index: 
    {
      type: String,
    },
    course_name: 
    {
      type: String,
    },
    course_folder: 
    {
      type: String,
    },

    // Instructor of the course
    course_prof: 
    {
      type: String,
    },

    // List of students in the course, by the id stored in database
    students_ids: 
    {
      type: [String]
    },
  });
  

module.exports = Course = mongoose.model("uw_mad_courses", CourseSchema);
