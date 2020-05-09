const express = require("express");
const { User } = require("../../models/user");
const { Course } = require("../../models/course");
const { Feed, validate } = require("../../models/feed");
const auth = require("../../middleware/auth");
const router = express.Router();
const validateObjectId = require("../../middleware/validateObjectId");
const admin = require("../../middleware/admin");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user)
    return res.status(401).send("User with the given Id was not found");

  const feeds = await Feed.find({ "course._id": { $in: user.courses } })
    .populate("postedBy")
    .select("-__v")
    .sort("datePosted");

  if (!feeds) return res.send("No feeds found for you");

  res.send(feeds);
});

router.get("/homework", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(401).send("User with the given Id was not found");

  const homeworks = await Feed.find({
    type: "homework",
    "course._id": { $in: user.courses }
  }).sort("deadline");

  res.send(homeworks);
});

router.get("/announcements", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  const announcements = await Feed.find({
    type: "announcement",
    "course._id": { $in: user.courses }
  }).sort("-datePosted");

  res.send(announcements);
});

router.get("/:id/homework", [auth, validateObjectId], async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).send("The course with the given ID does not exsit.");

  const homeworks = await Feed.find({
    type: "homework",
    "course._id": req.params.id
  })
    .populate("postedBy")
    .select("-__v")
    .sort("-datePosted");

  res.send(homeworks);
});

router.get("/:id/announcements", [auth, validateObjectId], async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).send("The course with the given ID does not exsit.");

  const announcements = await Feed.find({
    type: "announcement",
    "course._id": req.params.id
  })
    .populate("postedBy")
    .select("-__v")
    .sort("-datePosted");

  res.send(announcements);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findById(req.body.course);
  if (!course)
    return res.status(401).send("Course with the given Id was not found");

  let feed = await new Feed({
    postedBy: req.user._id,
    type: req.body.type,
    course: {
      _id: course._id,
      name: course.name
    },
    content: req.body.content,
    deadline: req.body.deadline
  });
  feed = await feed.save();

  res.send(feed);
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

  const feed = await Feed.findByIdAndUpdate(req.body._id, payload, {
    new: true
  });

  res.send(feed);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const feed = await Feed.deleteOne({ _id: req.params.id });

  if (!feed) return res.status(404).send("Feed does not exsit.");

  res.send(feed);
});

module.exports = router;
