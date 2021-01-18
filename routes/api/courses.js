const express = require("express");
const router = express.Router();

// Model
const Course = require("../../models/Course");
const User = require("../../models/User");
const UW_course = require("../../models/UW_Courses");

router.get("/courseSearch/:val", (req, res) => {
  const val = req.params.val;
  console.log(val);
  // UW_course.find({ course_folder: val }).then((course) => {
  //   // Check if user exists
  //   if (!course) {
  //     return res.status(404).json({ coursenotfound: "Course not found" });
  //   }

  //   // Course Found
  //   res.json({ sucess: true, courses: course});
  // });
  // UW_course.on('es-indexed', function(err,res) {
  //   if(err){
  //     res.send(err);
  //   }
  //   res.send(res)
  // } );
  UW_course.search({ query: ["anatomy"] }, function (err, results) {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
  // if(val === 'c'){
  //   res.json({ sucess: true, courses: ["c1", "c2"]});
  // }else{
  //   res.json({ sucess: true, courses: ["d1", "d2"]});}
});

router.post("/fetchCourse", async (req, res) => {
    const courseInfo = req.body;

    // Find the course
    const existingCourse = await UW_course.findOne({ course_uid: courseInfo.name });

    // If no such course exist, return error
    if (!existingCourse) {
        res.status(400).json({ message: "Course does not exist" });
    }

    // Otherwise, create an array of student
    let studentArray = [];

    // And start fetching student info based on their id
    for (const id of existingCourse.students_ids) {
        await User.findById(id).then((student) => studentArray.push(student));
    }

    // Return the list of student
    res.status(201).json({ studentList: studentArray });
});

router.post("/profAddCourse", async (req, res) => {
  const courseInfo = req.body;

  const existingCourse = await UW_course.findOne({
    course_uid: courseInfo.name,
    course_prof: courseInfo.prof,
  });

  if (!existingCourse) 
  {
    newCourse = new UW_course({ course_uid: courseInfo.name, course_prof: courseInfo.prof, });
    newCourse.save();

    res.status(201);
  } 
  else 
  {
    res.status(400).json({ message: "Course already exist" });
  }
});

//For usage Elsewhere
module.exports = router;
