const http = require('http');

const nStatic = require('node-static');

const fileServer = new nStatic.Server('./public');

module.exports = function (port) {
    http.createServer(function (req, res) {

        fileServer.serve(req, res);

    }).listen(port);
}