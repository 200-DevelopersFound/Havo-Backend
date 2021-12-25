const express = require("express");
const sendMail = require("../api/nodemailer");
const router = express.Router();
// const { User } = require("../models");
const User = require("../models/user");
const BlacklistToken = require("../models/blacklistToken");
const OTP = require("../models/otp");
const UserLogin = require("../models/userLogin");

/* GET home page. */
router.get("/", (_req, res, _next) => {
  // #swagger.tags = ['API Docs']
  res.redirect("/api-docs");
});

router.get("/deleteEverything", (_req, res, next) => {
  let ob = {};
  User.deleteMany({}, (err, payload) => {
    if (err) ob["User"] = err;
    else ob["User"] = payload;
  });
  BlacklistToken.deleteMany({}, (err, payload) => {
    if (err) ob["BlacklistToken"] = err;
    else ob["BlacklistToken"] = payload;
  });
  OTP.deleteMany({}, (err, payload) => {
    if (err) ob["OTP"] = err;
    else ob["OTP"] = payload;
  });
  UserLogin.deleteMany({}, (err, payload) => {
    if (err) ob["UserLogin"] = err;
    else ob["UserLogin"] = payload;
  });
  res.send(ob);
});

module.exports = router;
