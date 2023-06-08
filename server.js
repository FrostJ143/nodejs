require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./configs/corsOptions");
const verifyJWT = require("./middlewares/verifyJWT");
const credentials = require("./middlewares/credentials");
const connectDB = require("./configs/dbConn");

// Connect to DB
connectDB();

// Use custom middleware
app.use(logger);

app.use(credentials);

// Cross origin resource sharing
app.use(cors(corsOptions));

// Get data from form
app.use(express.urlencoded({ extended: false }));

// convert json to javascript object
app.use(express.json());

// parse cookie and put cookie data to req.cookies
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Use router
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.get("/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Connect to DB");

    app.listen(PORT, () => {
        console.log(`Sever is running on port ${PORT}`);
    });
});
