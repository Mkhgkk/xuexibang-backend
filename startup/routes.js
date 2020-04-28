const express = require("express");
const feeds = require("../routes/dashboard/feeds");
const comment = require("../routes/dashboard/comment");
const reply = require("../routes/dashboard/reply");
const courses = require("../routes/dashboard/courses");
const universities = require("../routes/universities");
const majors = require("../routes/majors");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/feeds", feeds);
  app.use("/api/comment", comment);
  app.use("/api/reply", reply);
  app.use("/api/courses", courses);
  app.use("/api/universities", universities);
  app.use("/api/majors", majors);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use(error);

  // other routes...
};
