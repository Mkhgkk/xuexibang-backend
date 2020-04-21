const express = require("express");
const feeds = require("../routes/dashboard/feeds");

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/dashboard/feeds', feeds);
    // other routes...
}