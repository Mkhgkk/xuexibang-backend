const winston = require("winston");
const express = require("express");

const app = express();

require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.POST || 5000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;