const winston = require("winston");
const express = require("express");

const app = express();

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const port = process.env.POST || 5000;

// require("./startup/static")(port)

app.use(express.static('public'))

const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
