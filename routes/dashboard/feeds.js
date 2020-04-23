const express = require("express");
const { User } = require("../../models/user");
const { Course } = require("../../models/course");
const { Feed, validate } = require("../../models/feed");
const auth = require("../../middleware/auth");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  const feeds = await Feed.find({ course: { $in: user.courses } })
    .select("-__v")
    .sort("datePosted");
  if (!feeds) return res.send("No feeds found for you");

  // const selectedCourses = user.courses.map(courseId => mongoose.Types.ObjectId(courseId).toHexString());

  // const results = feeds.filter(feed => selectedCourses.includes(mongoose.Types.ObjectId(feed.course).toHexString()));

  // const courses = _.intersection(feeds.map(feed => mongoose.Types.ObjectId(feed.course).toHexString()), selectedCourses);

  res.send(feeds);
});

router.get("/homeworks", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  const homeworks = await Feed.find({
    type: "homework",
    course: { $in: user.courses }
  }).sort("datePosted");

  res.send(homeworks);
});

router.get("/announcements", auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  const announcements = await Feed.find({
    type: "announcement",
    course: { $in: user.courses }
  }).sort("datePosted");

  res.send(announcements);
});

router.get("/homeworks/:courseId", auth, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course)
    return res.status(404).send("The course with the given ID does not exsit.");

  const homeworks = await Feed.find({
    type: "homework",
    course: req.params.courseId
  });

  res.send(homeworks);
});

router.get("/announcements/:courseId", auth, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course)
    return res.status(404).send("The course with the given ID does not exsit.");

  const announcements = await Feed.find({
    type: "announcement",
    course: req.params.courseId
  });

  res.send(announcements);
});

//admin only
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let feed = new Feed({
    postedBy: req.body.postedBy,
    type: req.body.type,
    course: req.body.course,
    content: req.body.content
  });
  feed = await feed.save();

  res.send(feed);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const feed = await Feed.findByIdAndUpdate(
    req.params.id,
    {
      deadline: req.body.deadline,
      content: req.body.content
    },
    { new: true }
  );

  if (!feed) return res.status(404).send("Feed does not exist.");
  res.send(feed);
});

router.delete("/:id", auth, async (req, res) => {
  const feed = await Feed.deleteOne({ _id: req.params.id });

  if (!feed) return res.status(404).send("Feed does not exsit.");

  res.send(feed);
});

module.exports = router;
