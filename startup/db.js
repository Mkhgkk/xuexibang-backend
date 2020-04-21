const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
    mongoose.connect("mongodb://localhost/xuexibang-backend")
        .then(() => winston.info("Connected to xuexibang backend"));
}