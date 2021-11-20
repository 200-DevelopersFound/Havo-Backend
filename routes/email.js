const express = require("express");
const otpGenerator = require("otp-generator");
const sendMail = require("../api/nodemailer");
const router = express.Router();
const OTP = require("../models/otp");

router.get("/otp", async (req, res, next) => {
  try {
    // const {email} = req.body;
    // if(!email){
    //     return next("Email not provided");
    //   }

    //   if(!type){
    //     return next("Type not provided");
    //   }

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
    };
    // encode the object here

    //   const encoded= await encode(JSON.stringify(details))
    sendMail(otp, details, (err, message) => {
      if (err) {
        console.log(err.message);
        return next(err);
      } else return res.json(details);
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/verify/otp", async (req, res, next) => {
  let currentdate = new Date();
  // const { verification_key, otp, check } = req.body;
  const verification_key = "key", otp = "TESTOTP" ;
  // decode the verification key here
   

})
module.exports = router;
