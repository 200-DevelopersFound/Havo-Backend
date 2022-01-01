// import { getAuth } from "firebase/auth";
// const auth = getAuth();
// auth.languageCode = "it";
const express = require("express");
const router = express.Router();
// const {
//   initializeApp,
//   getAuth,
//   signInWithPhoneNumber,
// } = require("firebase/app");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithPhoneNumber } = require("firebase/app");
// requireFromUrl("https://www.gstatic.com/firebasejs/6.3.3/firebase-auth.js");
// import { getAuth } from "firebase/auth";
// import { getAuth, signInWithPhoneNumber } from "firebase/auth";

// import { initializeApp } from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyB8Kxq0YvdYQwsW1v9tDYDOw67flbMxdEU",
  authDomain: "medium-d924f.firebaseapp.com",
  databaseURL: "https://medium-d924f.firebaseio.com",
  projectId: "medium-d924f",
  storageBucket: "",
  messagingSenderId: "488630368524",
  appId: "1:488630368524:web:dad0e9e3dc65b2ff",
};
router.get("/captcha", async (req, res, next) => {
  res.render("captcha");
});
router.post("/send", async (req, res) => {
  const app = initializeApp(firebaseConfig);
  console.log(req.body);
  const { verifier } = req.body;
  console.log(verifier);

  const phoneNumber = "+917004407830";
  const appVerifier = verifier;

  const auth = app.getAuth();
  app
    .signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      console.log(confirmationResult);
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      // window.confirmationResult = confirmationResult;
      // ...
    })
    .catch((error) => {
      console.log(error);
      // Error; SMS not sent
      // ...
    });

  res.send("success");
});
module.exports = router;
