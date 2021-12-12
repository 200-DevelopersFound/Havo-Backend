const jwt = require("jsonwebtoken");
const UserLogin = require("../models/userLogin");
const Blacklist = require("../models/blacklistToken");

const blacklistToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const bearer = authHeader && authHeader.split(" ")[0];
  if (bearer != "Bearer") return res.sendStatus(401);

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  Blacklist.findOne({ token: token }).then(found => {
    if (found) {
      jwt.verify(token, process.env.TOKEN_KEY, async(user, payload) => {
        const login = UserLogin.findOne({userId : payload.id, tokenId: payload.tokenId});
        login.loggedOut = true;
        login.tokenDeleted = true;
        login.save();
      });
      return res.status(401).json({Status: "Failure", message: "Token Blacklisted"});
    } else {
      // token not found to be added 
    }
  });
};
