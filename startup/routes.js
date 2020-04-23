const express = require("express");
const feeds = require("../routes/dashboard/feeds");
const courses = require("../routes/dashboard/courses");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/feeds", feeds);
  app.use("/api/courses", courses);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use(error);

  // other routes...
};
