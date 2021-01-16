const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");
const Schema = mongoose.Schema;

// Create Schema
const CourseSchema = new Schema({
  // Name of the course
  course_u_index: {
    type: String,  
    //es_indexed:true
  },
  course_name: {
    type: String,  
    //es_indexed:true
  },
  course_folder: {
    type: String,
  },

  // Instructor of the course
  course_prof: {
    type: String,
  },

  // List of students in the course, by the id stored in database
  students_ids: {
    type: [String],
  },
});

CourseSchema.plugin(mongoosastic,{  
  host:"portal-ssl1683-50.bmix-dal-yp-5a253ced-df2c-46d0-afe5-bab9b0e0567b.3862400473.composedb.com",
  port: 28960,
  protocol: "https",
  auth: "admin:ILUASRIXZUELZJKE"
//  ,curlDebug: true
});

module.exports = Course = mongoose.model("uw_mad_courses", CourseSchema);
