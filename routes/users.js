const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserLogins = require("../models/userLogin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const cid = require("custom-id-new");
const createToken = require("../util/token");
const blacklistToken = require("../middleware/blackListToken");
/* GET users listing. */
router.get("/", (req, res) => {
  res.send("respond with a resource");
});

// CREATE USER - /users/create
router.post("/create", async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.responses[200] = {  schema: {  }, description: 'TBA' } */
  /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'User SignUP Information',
                required: true,
                schema: { username : "Username - NoobMaster69", email : "XXXXXX@yyyy.com", password : "User-password"}
        } */
  /* #swagger.responses[400] = {
        description: 'Multiple 400 errors',
        schema: { 
          DetailsNotFound_Error : { error: "Username, Email, Password not found" },
          UsernameNotFound_Error : { error: "Username not found" },
          EmailNotFound_Error : { error: "Email not Found" },
          PasswordNotFound_Error : { error: "Password not Found" },
        },
       }
      */
  /* #swagger.responses[409] = {
        description: 'Multiple 409 errors',
        schema: { 
          UserEmail_Error : { error: "User Email already found." },
          UserName_Error : { error: "Username already used." },
        },
       }
      */
  // #swagger.responses[500] = { schema: { error: "Error message" }, description: 'Internal Server Error occured' }

  try {
    const { username, email, password } = req.body;

    if (!(username && email && password))
      return res
        .status(400)
        .json({ error: "Username, Email, Password not found" });
    else if (!username)
      return res.status(400).json({ error: "Username not found" });
    else if (!email) return res.status(400).json({ error: "Email not Found" });
    else if (!password)
      return res.status(400).json({ error: "Password not Found" });

    const dbUserEmail = await User.findOne({ email });
    if (dbUserEmail)
      return res.status(409).json({ error: "User Email already found." });

    const dbUserName = await User.findOne({ username });
    if (dbUserName)
      return res.status(409).json({ error: "Username already used." });

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
    return res.status(500).json({ error: err });
  }
});

// LOGIN USER - /users/login
router.post("/login", async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.responses[200] = {  schema: {  }, description: 'TBA' } */
  /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'User Login Information',
                required: true,
                schema: { email : "XXXXXX@yyyy.com", password : "User-password"}
        } */
  /* #swagger.responses[400] = {
        description: 'Multiple 400 errors',
        schema: { 
          DetailsNotFound_Error : { error: "Email, Password not found" },
          EmailNotFound_Error : { error: "Email not Found" },
          PasswordNotFound_Error : { error: "Password not Found" },
          InvalidCredentials_Error : { error: "Password not Found" },
        },
       }
      */
  // #swagger.responses[500] = { schema: { error: "Error message" }, description: 'Internal Server Error occured' }

  try {
    const { email, password } = req.body;

    if (!(email && password))
      return res.status(400).json({ error: "Email, Password not found" });
    else if (!email) return res.status(400).json({ error: "Email not found" });
    else if (!password)
      return res.status(400).json({ error: "Password not found" });

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
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

router.delete("/logout", blacklistToken, async (req, res) => {
  // #swagger.tags = ['User']
  return res.json({ message: "Token blacklisted. User logged out." });
});

module.exports = router;
