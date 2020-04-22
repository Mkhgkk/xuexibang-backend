const express = require("express");
const feeds = require("../routes/dashboard/feeds");
const courses = require("../routes/courses");
const users = require("../routes/users");
const auth = require("../routes/auth");
const myClasses = require("../routes/dashboard/myClasses");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/dashboard/feeds", feeds);
  app.use("/api/dashboard/myClasses", myClasses);
  app.use("/api/courses", courses);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  // other routes...
};
