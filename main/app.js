// To get server up and running:
// used the built-in 'http' library
var http = require("http");

// file system library to get our .html file
var fs = require("fs");
var index = fs.readFileSync("client_webpage.html");

// install in terminal: https://www.npmjs.com/package/serialport
var SerialPort = require("serialport");

const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimeter: "\r\n",
});

var port = new SerialPort(
  "location_of_port_here",

  /*
  Specify the location of the port.

  Read the instructions here:
  https://github.com/codeadamca/arduino-to-nodejs/tree/main

*/

  {
    baudRate: 9600,
    dataBits: 8,
    parity: "none",
    stopBits: 1,
    flowControl: false,
  }
);

// Attach port to parsers object
port.pipe(parser);

/*
     So when our parser receives data, it will run the function and
     store any data it receives in the function parameter `data`
*/

// ========= SERVER ======

var app = http.createServer(function (req, res) {
  res.writeHead(
    // response code: (OK Sucess)
    200,
    {
      "Content-Type": "text/html",
    }
  );
  res.end(index);
});

// for server side, install: https://www.npmjs.com/package/socket.io
// if this current version wont work, refer to this vid: https://www.youtube.com/watch?v=gQYsUjT-IBo
// or here: https://github.com/codeadamca/arduino-to-nodejs/tree/main
var io = require("socket.io");

// connect socket to our app:
io.listen(app);

// wait for the connection:
io.on("connection", function (data) {
  console.log("Node.js is listening");
});

// on data event
parser.on("data", function (data) {
  console.log(data);

  // emit (throw out) data when we receive a data from our parser
  io.emit("data", data);
});

// to sync with localhost
app.listen(3000); // argument value should be equal to your localhost
