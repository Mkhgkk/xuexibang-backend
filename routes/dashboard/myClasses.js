const express = require("express");
const { Course } = require("../../models/course");
const { User } = require("../../models/user");
const router = express.Router();
const auth = require("../../middleware/auth");
const _ = require("lodash");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const selectedCourses = user.courses;

  let courses = await Course.find();
  if (!courses) return res.status(404).send("No Courses");

  courses = _.intersection(courses.map(course => course._id, selectedCourses));

  res.send(courses);
});

module.exports = router;
