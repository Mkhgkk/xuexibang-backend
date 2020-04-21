const express = require("express");
const feeds = require("../routes/dashboard/feeds");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/dashboard/feeds", feeds);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  // other routes...
};
