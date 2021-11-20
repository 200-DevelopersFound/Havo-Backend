const express = require("express");
const otpGenerator = require("otp-generator");
const sendMail = require("../api/nodemailer");
const { encode, decode } = require("../middleware/secret");
const router = express.Router();
const OTP = require("../models/otp");
const date = require("../util/date");

router.post("/otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send("Email not provided");
    }
    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    const otpUser = await OTP.create({
      otp: otp,
    });
    const details = {
      message: "OTP sent to user",
      id: otpUser._id,
      check: email,
    };
    const encoded = await encode(details);
    sendMail(otp, details, (err, message) => {
      if (err) {
        return next(err.message);
      } else return res.json(encoded);
    });
  } catch (err) {
    return next(err.message);
  }
});

router.post("/verify/otp", async (req, res, next) => {
  try {
    let currentdate = new Date();
    const { verification_key, otp, check } = req.body;
    if (!verification_key) {
      return res.status(400).send("verification_key not provided");
    }
    if (!otp) {
      return res.status(400).send("otp not provided");
    }
    let decodeed;
    try {
      decodeed = await decode(verification_key);
    } catch {
      return res.status(400).send("decodecd corrupt");
    }

    const check_obj = decodeed.check;

    if (check_obj != check) {
      return res.status(400).send("Wrong email id ");
    }

    const otp_instance = await OTP.findById(decodeed.id);
    if (otp_instance != null) {
      if (otp_instance.verified != true) {
        if (date.compare(otp_instance.expirationTime, currentdate) == 1) {
          if (otp === otp_instance.otp) {
            otp_instance.verified = true;
            otp_instance.save();

            const response = {
              Status: "Success",
              Details: "OTP Matched",
              Check: check,
            };
            return res.status(200).send(response);
          } else {
            return res.status(400).send("OTP NOT Matched");
          }
        } else {
          return res.status(400).send("OTP Expired");
        }
      } else {
        return res.status(400).send("OTP already used");
      }
    } else {
      return res.status(400).send("Bad Request");
    }
  } catch (err) {
    return next(err.message);
  }
});
module.exports = router;
