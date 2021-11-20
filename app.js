const express = require("express");
const path = require("path");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const emailRouter = require("./routes/email");

const app = express();

require("./config/database").connect();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/email", emailRouter);

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;