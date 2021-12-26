const express = require("express");
const otpGenerator = require("otp-generator");
const { sendMail } = require("../api/nodemailer");
const { encode, decode } = require("../middleware/secret");
const router = express.Router();
const OTP = require("../models/otp");
const date = require("../util/date");

router.post("/trigger/otp", async (req, res, next) => {
  /*
    #swagger.tags = ['Email']
    #swagger.parameters['email'] = { in: 'body', description: 'Email id required for OTP', required: true, schema: { email: '200shreyans@gmail.com' }}
    #swagger.responses[400] = {  schema: { error: "Email not provided" }, description: 'Email not provided.' }
    #swagger.responses[200] = { schema: { "verification_key": "U2FsdGVkX1+ZMdUr8NfZX/FCeKFc1fdrnsVm1AONDODv6kxbHuQ/8ZoQcrAN2zmxUZUBWFn6ihnpHW+s/gNpc+Mg4pxk++JoMix1N3stdI4aAYSKdYsPx+V/tqvSgOGijabkUW1kRLcwWeMlTJO/2Q==" } , description: "OTP sent to user" }
    #swagger.responses[500] = { schema: { error: "Error message" }, description: 'Error occured' }
  */
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email not provided" });
    }
    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    const otpUser = await OTP.create({
      otp: otp,
      email: email,
    });
    const details = {
      message: "OTP sent to user",
      id: otpUser._id,
      check: email,
    };
    const encoded = await encode(details);
    sendMail(email, otp, (err, message) => {
      if (err) {
        return next(err.message);
      } else {
        return res.json({ verification_key: encoded });
      }
    });
  } catch (err) {
    return next(err.message);
  }
});

router.post("/verify/otp", async (req, res, next) => {
  /*
  #swagger.tags = ['Email']
  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'OTP Information',
    required: true,
    schema: { verification_key : "Verification Key from trigger OTP", otp : "XXXXXX", check : "Email ID to be verified"}
  }
  #swagger.responses[400] = {
    description: 'Multiple 400 errors',
    schema: {
    VerificationKey_Error : { error: "Verification_key not provided" },
    OTP_Error : { error: "OTP not provided" },
    WrongKey_Error_or_CorouptedKey_Error : {error : "Verification key corupted"},
    Check_Error : {error : "Email ID Incorrect"},
    WrongOtp_Error : {error : "OTP NOT Matched"},
    OTPExpired_Error : {error : "OTP Expired"},
    OTPAlreadyUsed_Error : {error : "OTP already used"},
    BadRequest_Error : {error : "Bad Request"}
    },
  }
  #swagger.responses[200] = { schema: { "status": "SUCCESS", "message": "OTP Matched", "check": "200shreyans@gmail.com" } , description: "OTP verified by user" }
  #swagger.responses[500] = { schema: { error: "Error message" }, description: 'Error occured' }
*/
  try {
    let currentdate = new Date();

    const { verification_key, otp, check } = req.body;
    if (!verification_key) {
      return res.status(400).json({ error: "Verification_key not provided" });
    }
    if (!otp) {
      return res.status(400).json({ error: "OTP not provided" });
    }
    let decodeed;
    try {
      decodeed = await decode(verification_key);
    } catch {
      return res.status(400).json({ error: "Verification key corupted" });
    }

    const check_obj = decodeed.check;

    if (check_obj != check) {
      return res.status(400).json({ error: "Email ID Incorrect" });
    }

    const otp_instance = await OTP.findById(decodeed.id);
    if (otp_instance != null) {
      if (otp_instance.verified != true) {
        if (date.compare(otp_instance.expirationTime, currentdate) == 1) {
          if (otp === otp_instance.otp) {
            otp_instance.verified = true;
            otp_instance.save();
            const response = {
              status: "SUCCESS",
              message: "OTP Matched",
              check: check,
            };
            return res.status(200).json(response);
          } else {
            return res.status(400).json({ error: "OTP NOT Matched" });
          }
        } else {
          return res.status(400).json({ error: "OTP Expired" });
        }
      } else {
        return res.status(400).json({ error: "OTP already used" });
      }
    } else {
      return res.status(400).json({ error: "Bad Request" });
    }
  } catch (err) {
    return next(err.message);
  }
});

module.exports = router;
