const express = require("express");
const router = express.Router();
const authToken = require("../middleware/index");
const UserLogin = require("../models/userLogin");
const User = require("../models/user");

/* Show user login */
router.get("/show", authToken, async (req, res, next) => {
  const user = await User.findOne({ id: req.user.id });
  if (user) {
    const userLogins = await UserLogin.findAll({
      userId: user.id,
      tokenDeleted: false,
    });
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let current = false;
    const logins = [];
    userLogins.forEach(async (userLogin) => {
      current = false;
      if (req.user.tokenId == userLogin.tokenId) {
        current = true;
      }
      let login = userLogin.get({ plain: true });
      login.current = current;
      logins.push(login);
    });
    return res.status(200).send({ user_logins: logins });
  }
  return res.status(400).send("Bad Request");
});

router.get("/delete/:login_id", authToken, async (req, res, next) => {
  console.log(req.params.login_id);
  const user = await User.findOne({ id: req.user.id });
  if (user) {
    const userLogin = await userLogins.findOne({ id: req.params.loginId });
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let current = false;
    if (req.user.tokenId == userLogin.tokenId) {
      current = true;
    }
    userLogin.tokenDeleted = true;
    await userLogin.save();
    return res.status(200).send({ deleted: true, userLogin: userLogin });
  }
  return res.status(400).send("Bad Request");
});

router.get("/delete/all/not-current", authToken, async (req, res, next) => {
  const user = await User.findOne({ id: req.user.id });
  if (user) {
    const userLogins = await userLogins.findAll({ userId: user.id });
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let current = false;
    let logins = [];
    userLogins.forEach(async (userLogin) => {
      current = false;
      if (req.user.tokenId == userLogin.tokenId) {
        current = true;
      }
      if (current != true) {
        userLogin.tokenDeleted = true;
        userLogin.loggedOut = true;
        await userLogin.save();
      }
      let login = userLogin.get({ plain: true });
      login.current = current;
      logins.push(login);
    });
    return res.status(200).send({ deleted: true, userLogin: logins });
  }
  return res.status(400).send("Bad Request");
});

router.get("/deletes/all", authToken, async (req, res, next) => {
  const user = await User.findOne({ id: req.user.id });
  if (user) {
    const userLogins = await userLogins.findAll({ userId: user.id });
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let current = false;
    let logins = [];
    userLogins.forEach(async (userLogin) => {
      current = false;
      if (req.user.tokenId == userLogin.tokenId) {
        current = true;
      }
      userLogin.tokenDeleted = true;
      userLogin.loggedOut = true;
      userLogin.save();
      let login = login.get({ plain: true });
      login.current = current;
      logins.push(login);
    });
    return res.status(200).send({ deleted: true, user_login: logins });
  }
  return res.status(400).send("Bad Request");
});

module.exports = router;
