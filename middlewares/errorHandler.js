const {logEvents} = require("./logEvents");

// Custom error handler 
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}:${err.message}`, "errorLog.txt");
    res.status(500).send(err.message);
}

module.exports = errorHandler;