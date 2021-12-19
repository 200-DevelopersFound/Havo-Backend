const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserLogins = require("../models/userLogin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const cid = require("custom-id-new");
const createToken = require("../util/token");

/* GET users listing. */
router.get("/", (req, res) => {
  res.send("respond with a resource");
});

// CREATE USER - /users/create
router.post("/create", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password))
      return res.status(400).send("Username, Email, Password not found");
    else if (!username) return res.status(400).send("Username not found");
    else if (!email) return res.status(400).send("Email not Found");
    else if (!password) return res.status(400).send("Password not Found");

    const dbUserEmail = await User.findOne({ email });
    if (dbUserEmail) return res.status(409).send("User already found.");

    const dbUserName = await User.findOne({ username });
    if (dbUserName) return res.status(409).send("Username already used.");

    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
    });

    req.user = newUser;
    req.auth = { id: req.user._id, register: true };

    req.token = await createToken(req);
    res.setHeader("x-auth-token", req.token);
    const responseOb = {
      auth: true,
      token: req.token,
      message: "User found and Logged in",
    };
    return res.status(200).json(responseOb);
  } catch (err) {
    return res.status(400).send(err);
  }
});

// LOGIN USER - /users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password))
      return res.status(400).send("Email, Password not found");
    else if (!email) return res.status(400).send("Email not found");
    else if (!password) return res.status(400).send("Password not found");

    const dbUser = await User.findOne({ email });

    if (dbUser && (await bcrypt.compare(password, dbUser.password))) {
      req.user = dbUser;
      req.auth = {
        id: req.user._id,
        register: false,
      };
      req.token = await createToken(req);
      res.setHeader("x-auth-token", req.token);
      const responseOb = {
        auth: true,
        token: req.token,
        message: "User found and Logged in",
      };
      return res.status(200).json(responseOb);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
