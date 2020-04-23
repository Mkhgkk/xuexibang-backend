const express = require("express");
const feeds = require("../routes/dashboard/feeds");
const comment = require("../routes/dashboard/comment");
const reply = require("../routes/dashboard/reply");
const courses = require("../routes/dashboard/courses");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/feeds", feeds);
  app.use("/api/comment", comment);
  app.use("/api/reply", reply);
  app.use("/api/courses", courses);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  // other routes...
};
