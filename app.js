const express = require("express");
const path = require("path");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
// const swagger = require("./swagger.js");

const swaggerFile = require("./swagger_output.json");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const emailRouter = require("./routes/email");
const loginRouter = require("./routes/loginActivity");

const app = express();

require("./config/database").connect();
// swagger();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

app.set("view engine", "ejs");
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/email", emailRouter);
app.use("/user/logins", loginRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).json({ error: err });
});

module.exports = app;
