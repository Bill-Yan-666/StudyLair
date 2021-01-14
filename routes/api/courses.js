const express = require("express");
const router = express.Router();

// Model
const Course = require("../../models/Course");
const User = require('../../models/User');

router.get("/:courseName", (req, res) => {
  const courseName = req.params.courseName;
  Course.findOne({ name: courseName }).then((course) => {
    // Check if user exists
    if (!course) {
      return res.status(404).json({ coursenotfound: "Course not found" });
    }

    // Course Found
    res.json({sucess: true,
    students: course.students});
  });
});

router.post('/fetchCourse', async (req, res) => {
  const courseInfo = req.body;

  // Find the course
  const existingCourse = await Course.findOne({ name: courseInfo.name, prof: courseInfo.prof });

  // If no such course exist, return error
  if (!existingCourse)
  {
    res.status(400).json({ message: 'Course does not exist' });
  }

  // Otherwise, create an array of student
  let studentArray = [];

  // And start fetching student info based on their id
  for (const id of existingCourse.students) 
  {
    await User.findById(id)
    .then((student) => studentArray.push(student));
  }

  // Return the list of student
  res.status(201).json({ studentList: studentArray });
});

// This patch function offer no safety check, can be added later
router.patch("/dropStudent/:student", async (req, res) => {
  const { student: id } = req.params;
  const courseInfo = req.body;

  // Find the course
  const existingCourse = await Course.findOne({ name: courseInfo.name, prof: courseInfo.prof });

  // Remove student from the list, and decrement the count
  existingCourse.counter = existingCourse.counter - 1;
  existingCourse.students = existingCourse.students.filter((student) => student !== id);

  // Replace the original object
  await Course.findByIdAndUpdate(existingCourse._id, existingCourse, { new: true });

  res.status(201);
})

router.post("/profAddCourse", async (req, res) => {
  const courseInfo = req.body;

  const existingCourse = await Course.findOne({ name: courseInfo.name, prof: courseInfo.prof });

  if (!existingCourse)
  {
    newCourse = new Course(courseInfo);
    newCourse.save();

    res.status(201);
  }
  else
  {
    res.status(400).json({ message: 'Course already exist' });
  }
});

//For usage Elsewhere
module.exports = router;
