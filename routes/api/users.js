const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const _ = require("lodash");
const User = require("../../models/User");
const Course = require("../../models/Course");
const CourseNew = require("../../models/UW_Courses");
const { ObjectId } = require("mongodb");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      const newCourse = new Course({
        name: "c2",
        prof: "Leonard Susskind",
        students: ["mike", "paul", "sasha"],
        counter: 3,
      });
      newCourse.save();

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// router.post("/classes", (req,res) => {

// })

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          classList: user.classList,
          // test1: [c1, c2]
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// This route accepts student id as parameter
router.get("/getStudent/:id", async (req, res) => {
  const { id } = req.params;

  // Find the student
  const student = await User.findById(id);

  // Return the class list
  res.status(200).json(student);
  console.log("Student fetched");
});

// This route accepts course as the body, and id as parameter
router.patch("/enrollCourse/:student", async (req, res) => {
  const { student: id } = req.params;

  const course = req.body;

  // Find the student
  const student = await User.findById(id);

  //See if the student already enrolled in the course
  for (const enrolledCourse of student.classList) {
    if (enrolledCourse[0] === course.name) {
      res.status(400).json({ message: "Already enrolled in this course" });
      return;
    }
  }
  console.log(course.name);

  //Next find the course
  //////////////////////////////////////////////////////
  const existingCourse = await CourseNew.findOne({
    course_uid: course.name,
  });
  console.log(existingCourse);

  console.log(course.name);
  ///////////////////////////////////////////////////
  // CourseNew.findOne(
  //   { course_u_index: "CBE 150" },
  //   function (err, course_i) {
  //     console.log(course_i);
  //   }
  // );

    // If no such course exist
    if (!existingCourse) {
      res
        .status(400)
        .json({ message: "Our database does not contain this course" });
      return;
    }

    // else{
    //   res.status(200).json({message: "found"});
    // }

    // // Update the course list inside the current student
    student.classList = [...student.classList, [course.name, "default name"]];

    // Update the student list inside the existing course
    existingCourse.students_ids = [...existingCourse.students_ids, id];
    //existingCourse.counter = existingCourse.counter + 1;

    // Update both items
    await User.findByIdAndUpdate(id, student, { new: true });
    await CourseNew.findByIdAndUpdate(existingCourse._id, existingCourse, {
      new: true,
    });

    res.status(201).json(student);
    console.log("Course added");
  });

  // This route accepts student as the body, and course name as parameter
  router.patch("/dropCourse/:student", async (req, res) => {
    const { student: id } = req.params;
    const courseName = req.body.name;

    console.log(courseName);
    console.log(id);

    // Find the student
    const student = await User.findById(id);
    const course = await CourseNew.findOne({
      course_uid: courseName,
    });

    //Update the course list inside the current student
    student.classList = student.classList.filter(
      (combo) => combo[0] !== courseName
    );
    //Update Student List in course
    course.students_ids = course.students_ids.filter((combo) => combo !== id);

    //Update it
    await User.findByIdAndUpdate(id, student, { new: true });
    await CourseNew.findByIdAndUpdate(course._id, course, {new: true});

    res.status(201).json(student);
    console.log("Course dropped");
});

// This route accepts student as the body
router.patch("/updateStudent", async (req, res) => {
  const student = req.body;
  const id = student.id ? student.id : student._id;

  // Find and update
  await User.findByIdAndUpdate(id, student, { new: true });

  res.status(201);
  console.log("Student updated");
});

module.exports = router;
