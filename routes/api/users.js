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
const UW_Course = require("../../models/UW_Courses");
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

    // Return the student
    res.status(200).json(student);
    console.log("Student fetched");
});

// This route accepts course as the body, and id as parameter
// Enroll the student in the course, and add the course to the student
router.patch("/enrollCourse/:student", async (req, res) => 
{
    const { student: id } = req.params;

    const course = req.body;

    // Find the student
    const student = await User.findById(id);

    // See if the student already enrolled in the course
    for (const enrolledCourse of student.classList) 
    {
            if (enrolledCourse.class_name === course.name) 
            {
                res.status(400).json({ message: "Already enrolled in this course" });
                return;
            }
    }

    // Next find the course

    const existingCourse = await UW_Course.findOne({course_uid: course.name,});

    // If no such course exist
    if (!existingCourse) 
    {
        res.status(400).json({ message: "Our database does not contain this course" });
        return;
    }

    // Update the course list inside the current student
    student.classList = [...student.classList, { class_name: course.name, buddy_list: [], unlike_list: [], }];

    // Update the student list inside the existing course
    existingCourse.students_ids = [...existingCourse.students_ids, id];

    // Update both items
    await User.findByIdAndUpdate(id, student, { new: true });
    await UW_Course.findByIdAndUpdate(existingCourse._id, existingCourse, { new: true, });

    res.status(201).json(student);
    console.log("Course added");
});

// This route accepts student as the body, and course name as parameter
// Remove student from the course, also delete the course from student
router.patch("/dropCourse/:student", async (req, res) => {
    const { student: id } = req.params;
    const courseName = req.body.name;

    // Find the student
    const student = await User.findById(id);
    const course = await UW_Course.findOne({ course_uid: courseName, });

    //Update the course list inside the current student
    student.classList = student.classList.filter((combo) => combo.class_name !== courseName);

    //Update Student List in course
    course.students_ids = course.students_ids.filter((student_id) => student_id !== id);

    //Update it
    await User.findByIdAndUpdate(id, student, { new: true });
    await UW_Course.findByIdAndUpdate(course._id, course, { new: true });

    res.status(201).json(student);
    console.log("Course dropped");
});

// This route accepts student as the body
// Update the entire student object inside the database
// Used for profile update
router.patch("/updateStudent", async (req, res) => {
    const student = req.body;
    const id = student.id ? student.id : student._id;

    // Find and update
    await User.findByIdAndUpdate(id, student, { new: true });

    res.status(201);
    console.log("Student updated");
});

router.patch('/removeBuddy', async (req, res) =>
{
    const { userId, buddyId, className } = req.body;

    // Find the user and the buddy
    const user = await User.findById(userId);
    const buddy = await User.findById(buddyId);

    // Remove each other from the buddy list
    for (const item of user.classList)
    {
        if (item.class_name === className)
        {
            item.buddy_list = item.buddy_list.filter((bud) => bud.buddy_id !== buddyId);
            break;
        }
    }

    for (const item of buddy.classList)
    {
        if (item.class_name === className)
        {
            item.buddy_list = item.buddy_list.filter((bud) => bud.buddy_id !== userId);
            break;
        }
    }

    // Update both the user and the buddy
    await User.findByIdAndUpdate(userId, user, { new: true });
    await User.findByIdAndUpdate(buddyId, buddy, { new: true });

    res.status(201).json(user);
    console.log('Buddy removed');
})

module.exports = router;
