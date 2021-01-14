const express = require("express");
const router = express.Router();

const Vector = require("../../models/TrainingData");

router.get("/me", (req, res) => {
  res.send("hey");
});

router.post("/add", function (req, res) {
  const payload = req.body;
  const newEntry = new Vector({
    name: payload.name,
    gender: payload.gender,
    major: payload.major,
    graduationYear: payload.graduationYear,
    dayPref: payload.dayPref,
    timeSlot: payload.timeSlot,
    courseList: payload.courseList,
  });

  newEntry.save((err, entry) => {
    if (err) {
      return res
        .status(404)
        .json({ data_entry_improper: "make sure to spell check", error: err });
    }
    res.json({success: true,
        data_entry_: entry
    })
  });
});

module.exports = router;
