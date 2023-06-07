const http = require("http");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = require("./logEvents");
const EventEmmitter = require("events");
const { log } = require("console");
const { fi } = require("date-fns/locale");
class MyEmitter extends EventEmmitter {}

const myEmitter = new MyEmitter();

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, res) => {
    try {
        const rawData = await fsPromises.readFile(filePath, 
            contentType.includes("image") ? "" : "utf-8"
        );
        const data = contentType === "application/json" ? JSON.parse(rawData) : rawData;
        res.writeHead(filePath.includes("404.html") ? 400 : 200, {"Content-type": contentType});
        res.end(
            contentType === "application/json" ? JSON.stringify(data) : data
        );
    } catch (error) {
        myEmitter.emit("log", `${error.name}:${error.message}`, "errorLog.txt");
        res.statusCode = 500;
        res.end();
    }
}

const server = http.createServer((req, res) => {
    myEmitter.emit("log", `${req.url}\t${req.method}\t`, "reqLog.txt");
    const extension = path.extname(req.url);

    let contentType;
    switch(extension) {
        case ".css": 
            contentType = "text/css";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".jpg":
            contentType = "image/jpeg";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".txt":
            contentType = "text/plain";
            break;
        default: 
            contentType = "text/html";
    }

    let filePath = (contentType === "text/html" && req.url === "/") 
            ? path.join(__dirname, "views", "index.html") 
            : (contentType === "text/html" && req.url.slice(-1) === "/")
                ? path.join(__dirname, "views", req.url, "index.html")
                : contentType === "text/html" 
                    ? path.join(__dirname, "views", req.url)
                    : path.join(__dirname, req.url); 

    // Can request file html without .html 
    if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

    const fileExists = fs.existsSync(filePath);
    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        switch (path.parse(filePath).base) {
            case "old-page.html": 
                res.writeHead(301, {"Location": "/new-page.html"});
                res.end();
                break;
            case "www-page.html": 
                res.writeHead(301, {"Location": "/"});
                res.end();
                break;
            default: 
                serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

myEmitter.on("log", (msg, logFile) => logEvents(msg, logFile));
