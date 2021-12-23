const express = require("express");
const router = express.Router();
const authToken = require("../middleware/index");
const UserLogin = require("../models/userLogin");
const User = require("../models/user");

// SHOW ALL LA - /user/logins/show
router.get("/show", authToken, async (req, res, _next) => {
  // #swagger.tags = ['Login Activity']
  /* #swagger.responses[200] = {  schema: {  }, description: 'TBA' } */
  /* #swagger.responses[400] = {  schema: { error: "Bad Request" }, description: 'Unauthorized' } */

  const user = await User.findOne({ _id: req.user.id });

  if (user) {
    const userLogins = await UserLogin.find({
      userId: user.id,
      tokenDeleted: false,
    }).lean();

    // const ip =
    //   (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    //   req.connection.remoteAddress ||
    //   req.socket.remoteAddress ||
    //   req.connection.socket.remoteAddress;
    let current = false;
    let logins = [];
    userLogins.forEach((userLogin) => {
      current = false;
      if (req.user.token_id == userLogin.tokenId) {
        current = true;
      }
      let login = userLogin;
      login.current = current;
      login["current"] = current;
      logins.push(login);
    });
    return res.status(200).json({ user_logins: logins });
  }
  return res.status(400).json({ error: "Bad Request" });
});

// DELETE LA ID - /user/logins/delete/:login_id
router.get("/delete/:login_id", authToken, async (req, res, _next) => {
  // #swagger.tags = ['Login Activity']
  /* #swagger.responses[200] = {  schema: {  }, description: 'TBA' } */
  /* #swagger.responses[400] = {  schema: { error: "Bad Request" }, description: 'Unauthorized' } */

  const user = await User.findOne({ _id: req.user.id });
  if (user) {
    const userLogin = await UserLogin.findOne({
      tokenId: req.params.login_id,
    });
    // const ip =
    //   (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    //   req.connection.remoteAddress ||
    //   req.socket.remoteAddress ||
    //   req.connection.socket.remoteAddress;
    let current = false;
    if (req.user.token_id == userLogin.tokenId) {
      current = true;
    }
    userLogin.tokenDeleted = true;
    await userLogin.save();
    return res.status(200).json({ deleted: true, userLogin: userLogin });
  }
  return res.status(400).json({ error: "Bad Request" });
});

// DELETE OTHERS - /user/logins/delete/all/not-current
router.get("/delete/all/not-current", authToken, async (req, res, _next) => {
  // #swagger.tags = ['Login Activity']
  /* #swagger.responses[200] = {  schema: {  }, description: 'TBA' } */
  /* #swagger.responses[400] = {  schema: { error: "Bad Request" }, description: 'Unauthorized' } */

  const user = await User.findOne({ _id: req.user.id });
  if (user) {
    const userLogins = await UserLogin.find({ userId: user.id });
    // const ip =
    //   (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    //   req.connection.remoteAddress ||
    //   req.socket.remoteAddress ||
    //   req.connection.socket.remoteAddress;
    let current = false;
    let logins = [];
    userLogins.forEach(async (userLogin) => {
      current = false;
      if (req.user.token_id == userLogin.tokenId) {
        current = true;
      }
      if (current != true) {
        userLogin.tokenDeleted = true;
        userLogin.loggedOut = true;
        await userLogin.save();
      }
      let login = userLogin;
      login.current = current;
      logins.push(login);
    });
    return res.status(200).json({ deleted: true, userLogin: logins });
  }
  return res.status(400).json({ error: "Bad Request" });
});

// DELETE ALL - /user/logins/deletes/all
router.get("/deletes/all", authToken, async (req, res, _next) => {
  // #swagger.tags = ['Login Activity']
  /* #swagger.responses[200] = {  schema: {  }, description: 'TBA' } */
  /* #swagger.responses[400] = {  schema: { error: "Bad Request" }, description: 'Unauthorized' } */

  const user = await User.findOne({ _id: req.user.id });
  if (user) {
    const userLogins = await UserLogin.find({ userId: user.id });
    // const ip =
    //   (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    //   req.connection.remoteAddress ||
    //   req.socket.remoteAddress ||
    //   req.connection.socket.remoteAddress;
    let current = false;
    let logins = [];
    userLogins.forEach(async (userLogin) => {
      current = false;
      if (req.user.token_id == userLogin.tokenId) {
        current = true;
      }
      userLogin.tokenDeleted = true;
      userLogin.loggedOut = true;
      userLogin.save();
      let login = userLogin;
      login.current = current;
      logins.push(login);
    });
    return res.status(200).json({ deleted: true, user_login: logins });
  }
  return res.status(400).json({ error: "Bad Request" });
});

module.exports = router;
