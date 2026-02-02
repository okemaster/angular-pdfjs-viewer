var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').Server(app);
var path = require('path');

app.use(cors());

// Serve static files from the project root
var rootPath = path.resolve(__dirname + '/..');
app.use(express.static(rootPath));

// Specifically serve index.html for the root path
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(48080, function () {
    console.log('Server is listening on localhost:48080');
});