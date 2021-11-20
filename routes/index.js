const express = require("express");
const sendMail = require("../api/nodemailer");
const router = express.Router();

/* GET home page. */
router.get("/", (_req, res, _next) => {
  res.render("index", { title: "Express" });
});

router.get("/send", (_req, res, next) => {
  sendMail("123:TEST", { message: "TestRun" }, (err, message) => {
    if (err) {
      return next(err);
    } else return res.json(message);
  });
});

module.exports = router;
