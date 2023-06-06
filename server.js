const http = require("http");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = require("./logEvents");
const EventEmmitter = require("events");
class MyEmitter extends EventEmmitter {}

const myEmitter = new MyEmitter();

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    console.log(path.extname(req.url));
    console.log(req.url.slice(-1));
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
