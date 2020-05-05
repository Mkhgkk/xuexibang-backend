const express = require("express");
const { Course, validate } = require("../../models/course");
const { User } = require("../../models/user");
const router = express.Router();
const auth = require("../../middleware/auth");
const validateObjectId = require("../../middleware/validateObjectId");
const admin = require("../../middleware/admin");

// router.get("/", auth, async (req, res) => {
//   const courses = await Course.find()
//     .select("-qqNumber, -notes")
//     .sort("name");
//   res.send(courses);
// });

router.get("/search/:number", auth, async (req, res) => {
  const courses = await Course.find({ number: req.params.number })
    .select("-qqNumber, -notes")
    .sort("name");

  res.send(courses);
});

//:id equals courseId
router.get("/course/:id", [auth, validateObjectId], async (req, res) => {
  const course = await Course.findById(req.params.id).select("-__v");
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
    .select("userName avatar _id")
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
  const courses = await Course.find({ admin: { $in: [req.user._id] } })
    .select("name _id time")
    .sort("name");

  res.send(courses);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let course = await Course.findOne({
    number: req.body.number,
    university: req.body.university
  });
  if (course) return res.status(400).send("Course already exist.");

  course = new Course({
    name: req.body.name,
    number: req.body.number,
    university: req.body.university,
    major: req.body.major,
    weeks: req.body.weeks,
    laoshi: req.body.laoshi,
    qqNumber: req.body.qqNumber,
    time: req.body.time,
    classroom: req.body.classroom,
    notes: req.body.notes,
    semester: req.body.semester,
    thumbnail: req.body.thumbnail,
    admin: [req.user._id]
  });

  course = await course.save();

  res.send(course);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const course = await Course.findByIdAndRemove(req.params.id);

  if (!course) return res.status(404).send("This course does not exist.");

  res.send(course);
});

router.put("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let payload = {};

  const keys = Object.keys(req.body);

  let i;
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    payload[key] = req.body[key];
  }

  const course = await Course.findByIdAndUpdate(req.body._id, payload, {
    new: true
  });

  res.send(course);
});

module.exports = router;
