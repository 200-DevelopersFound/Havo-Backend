const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const user = require("../models/user");

/* GET users listing. */
router.get("/", (req, res) => {
  res.send("respond with a resource");
});

// CREATE USER
router.post("/create", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password))
      return res.status(400).send("Username, Email, Password not found");
    else if (!username) return res.status(400).send("Username not found");
    else if (!email) return res.status(400).send("Email not Found");
    else if (!password) return res.status(400).send("Password not Found");

    const dbUser = await User.findOne({ email });
    if (dbUser) return res.status(409).send("User already found.");

    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
    });

    const token = jwt.sign(
      { user_id: newUser._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );
    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password))
      return res.status(400).send("Email, Password not found");
    else if (!email) return res.status(400).send("Email not found");
    else if (!password) return res.status(400).send("Password not found");

    const dbUser = await User.findOne({ email });

    if (dbUser && (await bcrypt.compare(password, dbUser.password))) {
      const token = jwt.sign(
        { user_id: newUser._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      user.token = token;
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
