const express = require("express");
const { Course, validate } = require("../../models/course");
const { User } = require("../../models/user");
const router = express.Router();
const auth = require("../../middleware/auth");
const _ = require("lodash");
const validateObjectId = require("../../middleware/validateObjectId");
const admin = require("../../middleware/admin");

router.get("/", auth, async (req, res) => {
  const courses = await Course.find()
    .select("-qqNumber, -notes")
    .sort("name");
  res.send(courses);
});

//:id equals courseId
router.get("/course/:id", [validateObjectId], async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).send("The course with the given ID dosen't exist.");

  res.send(course);
});

//:id equals courseId
router.get("/:id/students", [auth, validateObjectId], async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).send("The course with the given ID does not exist.");

  const students = await User.find({
    courses: { $in: [req.params.id] }
  })
    .select("userName, avatar, _id")
    .sort("userName");

  res.send(students);
});

router.get("/myCourses", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  const courses = await Course.find({
    _id: { $in: user.courses }
  }).sort("name");

  res.send(courses);
});

router.get("/admin", [auth, admin], async (req, res) => {
  const courses = await Course.find({ admin: { $in: [req.user._id] } }).sort(
    "name"
  );

  res.send(courses);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let course = await Course.findOne({
    number: req.body.number,
    university: req.body.university
  });
  if (course) return res.status(400).send("Course already registered.");

  course = new Course(
    _.pick(req.body, [
      "name",
      "number",
      "university",
      "major",
      "laoshi",
      "semester",
      "weeks",
      "time",
      "classroom",
      "qqNumber",
      "notes",
      "thumbnail",
      "admin"
    ])
  );

  course = await course.save();

  res.send(course);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const course = await Course.deleteOne({ _id: req.params.id });

  if (!course) return res.status(404).send("This course does not exist.");

  res.send(course);
});

router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    {
      weeks: req.body.weeks,
      laoshi: req.body.laoshi,
      qqNumber: req.body.qqNumber,
      time: req.body.time,
      classRoom: req.body.classRoom,
      notes: req.body.notes
    },
    { new: true }
  );

  if (!course) return res.status(404).send("Course does not exist.");
  res.send(course);
});

module.exports = router;
