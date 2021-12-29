const express = require("express");
const path = require("path");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const swaggerFile = require("./swagger_output.json");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const emailRouter = require("./routes/email");
const loginRouter = require("./routes/loginActivity");
const categoryRouter = require("./routes/category");

const app = express();
const bodyParser = require("body-parser"); //add this

require("./config/database").connect();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/email", emailRouter);
app.use("/user/logins", loginRouter);
app.use("/user/category", categoryRouter);

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: err });
});

module.exports = app;
