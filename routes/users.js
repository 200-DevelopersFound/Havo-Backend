const express = require("express");
const router = express.Router();
const User = require("../models/user");
const OTP = require("../models/otp");
const bcrypt = require("bcryptjs/dist/bcrypt");
const createToken = require("../util/token");
const blacklistToken = require("../middleware/blackListToken");
const { sendPasswordResetLink } = require("../api/nodemailer");
const customId = require("custom-id-new");
const date = require("../util/date");
const authToken = require("../middleware");

// CREATE USER - /users/create
router.post("/create", async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.responses[200] = {  schema: { "auth": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYzZlMmZmMTYyMDUyZmNiYjI0OGZlYyIsInRva2VuX2lkIjoiODc5OEdUREQyODI2WkZQQiIsImlhdCI6MTY0MDQyNDE5Mn0.89JxJwWzT3DMSGCX3zQtPpf5rgSSJVS2cvpDwHUn-4U", "message": "User created and Logged in" }, description: 'Create User in database with proper credentials.' } */
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
  /* #swagger.responses[401] = {
        description: 'Multiple 401 errors',
        schema: { 
          UserEmailNotVerified_Error : { error: "Email not verified" },
          OTPNotVerified_Error : { error: "OTP not verified" },
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

    const emailVerified = await OTP.findOne({ email: email });
    console.log(emailVerified);
    if (!emailVerified)
      return res.status(401).json({ error: "Email not verified" });
    if (!emailVerified.verified)
      return res.status(401).json({ error: "OTP not verified" });

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
      message: "User created and Logged in",
    };
    return res.status(200).json(responseOb);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// LOGIN USER - /users/login
router.post("/login", async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.responses[200] = {  schema: { "auth": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYzg5MGJiY2JmMjc1NDAwZDRkZGJmOSIsInRva2VuX2lkIjoiOTEwOVpGTVAxMDE0RUFBVSIsImlhdCI6MTY0MDUzNDI5N30.x92jESKmKLYFp1VbHBM9JMbUh8jfmR56ChrTIBb0_II", "message": "User found and Logged in"
}, description: 'User logged in' } */
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

router.post("/forget/password", async (req, res, next) => {
  // #swagger.tags = ['User']
  /* #swagger.responses[200] = {  schema: { message: "Password reset OTP sent to user`s registered Email Id" }, description: 'User logged in' } */
  /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Registered Email Id',
                required: true,
                schema: { email : "XXXXXX@yyyy.com"}
        } */
  /* #swagger.responses[400] = {  schema: { error: "Email not found" }, description: 'User not found' } */
  /* #swagger.responses[404] = {  schema: { error: "User not found" }, description: 'User not found' } */

  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email not found" });

    const dbUser = await User.findOne({ email });
    const forgetToken = await customId({
      date: Date.now(),
    });
    if (dbUser) {
      dbUser.resetPasswordToken = forgetToken;
      dbUser.resetPasswordExpiry = new Date().getTime() + 1000000;
      await dbUser.save();
    } else {
      return res.status(404).json({ error: "User not found" });
    }
    sendPasswordResetLink(email, forgetToken, (err, payload) => {
      if (err) {
        return next(err.message);
      } else
        return res.json({
          message: "Password reset OTP sent to user`s registered Email Id",
        });
    });
  } catch (err) {
    // #swagger.responses[500] = { schema: { error: "Error message" }, description: 'Error occured' }
    return next(err.message);
  }
});

router.post("/update/password", async (req, res, next) => {
  // #swagger.tags = ['User']
  /* #swagger.responses[200] = {  schema: { message: "Password reset OTP sent to user`s registered Email Id" }, description: 'User logged in' } */
  /* #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Update User Password without logged in.',
                required: true,
                schema: {  resetPasswordToken: "AB12CD2", password : "XXXAAABB", email : "XXXXXX@yyyy.com"}
        } */
  /* #swagger.responses[400] = {  
    description: 'Multiple 400 Errors',
    schema: {
    ResetPasswordTokenNotFound_Error : { error: "Reset Password Token not provided" }, 
    PasswordNotFound_Error : { error: "Password not provided" },
    OTPExpired_Error : { error: "OTP Expired" },
    EmailNotFound_Error : { error: "Email not Expired" }
    }
  }
    */
  /* #swagger.responses[404] = {  schema: { error: "No user found with this Email ID" }, description: 'User not found' } */
  /* #swagger.responses[204] = {  schema: { status: "Password reset successfull" }, description: 'User logged in' } */
  /* #swagger.responses[401] = {  schema: { error: "Unauthorized" }, description: 'User logged in' } */

  try {
    let currentdate = new Date();
    const { email, resetPasswordToken, password } = req.body;
    if (!resetPasswordToken) {
      return res
        .status(400)
        .json({ error: "Reset Password Token not provided" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email not provided" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password not provided" });
    }

    const dbUser = await User.findOne({ email });
    console.log(dbUser);
    if (dbUser != null) {
      if (date.compare(dbUser.resetPasswordExpiry, currentdate) == 1) {
        if (resetPasswordToken == dbUser.resetPasswordToken) {
          dbUser.password = await bcrypt.hash(password, 10);
          dbUser.resetPasswordToken = null;
          dbUser.resetPasswordExpiry = null;
          await dbUser.save();
          return res.status(204).json({ status: "Password reset successfull" });
        } else {
          return res.status(401).json({ error: "Unauthorized" });
        }
      } else {
        // token expired
        dbUser.resetPasswordToken = null;
        dbUser.resetPasswordExpiry = null;
        await dbUser.save();
        return res.status(400).json({ error: "OTP Expired" });
      }
    } else {
      return res
        .status(404)
        .json({ error: "No user found with this Email ID" });
      // user doesnot exist
    }
  } catch (error) {
    // #swagger.responses[500] = { schema: { error: "Error message" }, description: 'Error occured' }
    return next(error.message);
  }
});
// });

router.put("/update/user/password", authToken, async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.responses[204] = {  schema: { status: "Password update successfull" }, description: 'User logged in' } */
  /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Update User Password when logged in',
                required: true,
                schema: { password : "XXXXXXewfefyyy"}
        } */
  /* #swagger.responses[400] = {  schema: { error: "Bad Request" }, description: 'User not found' } */

  try {
    const { password } = req.body;
    const user = await User.findOne({ _id: req.user.id });
    if (user) {
      user.password = dbUser.password = await bcrypt.hash(password, 10);
      await user.save();
      return res.status(204).json({ status: "Password update successfull" });
    }
    return res.status(400).json({ error: "Bad Request" });
  } catch (error) {
    // #swagger.responses[500] = { schema: { error: "Error message" }, description: 'Error occured' }
    return next(error.message);
  }
});

module.exports = router;
