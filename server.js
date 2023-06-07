const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3500;
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./configs/corsOptions");

// Use custom middleware
app.use(logger);

// Cross origin resource sharing

app.use(cors(corsOptions));

// Get data from form
app.use(express.urlencoded({ extended: false }));

// convert json to javascript object
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Use router
app.use("/", require("./routes/root"));
app.use("/employees", require("./routes/api/employees"));

app.get("/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`);
});
