const express = require("express");
const { User } = require("../../models/user");
const { Course } = require("../../models/course");
const { Feed, validate } = require("../../models/feed");
const auth = require("../../middleware/auth");
const _ = require("lodash");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    const feeds = await Feed.find({ course: { $in: user.courses } }).select("-__v");
    if (!feeds) return res.send("No feeds found for you");

    // const selectedCourses = user.courses.map(courseId => mongoose.Types.ObjectId(courseId).toHexString());

    // const results = feeds.filter(feed => selectedCourses.includes(mongoose.Types.ObjectId(feed.course).toHexString()));

    // const courses = _.intersection(feeds.map(feed => mongoose.Types.ObjectId(feed.course).toHexString()), selectedCourses);

    res.send(feeds)
})

router.post("/", async (req, res) => {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let feed = new Feed({ postedBy: req.body.postedBy, type: req.body.type, course: req.body.course, content: req.body.content })
    feed = await feed.save()
    res.send(feed)


})


module.exports = router;