const express = require("express");
const { Course, validate } = require("../models/course");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");

router.get("/", (req, res) => {
    const courses = await Course.find().sort('number');
    res.send(courses);
});

router.get(":/id", auth, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).send("The course with the given ID dosen't exist.");
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
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

//admin only
router.delete("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.deleteOne({ _id: req.body._id });

  if (!course) return res.status(404).send("This course does not exist.");

  res.send(course);
});

//admin only
router.put("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findByIdAndUpdate(
    req.body._id,
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
  res.send(user);
});

module.exports = router;
