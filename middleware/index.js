const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklistToken");
const UserLogin = require("../models/userLogin");

const authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // const bearer = authHeader && authHeader.split(" ")[0];
  // if (bearer != "Bearer") return res.sendStatus(401);

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  // const dbUser = await User.findOne({ email });
  BlacklistToken.findOne({ token }).then((tokenFound) => {
    if (tokenFound) {
      return res.status(401).json({
        Status: "Failure",
        Details: "Token blacklisted. Cannot use this token.",
      });
    } else {
      jwt.verify(token, process.env.TOKEN_KEY, async (err, payload) => {
        if (err) return res.sendStatus(403);
        if (payload) {
          const login = await UserLogin.findOne({
            userId: payload.id,
            tokenId: payload.token_id,
          });
          if (login.tokenDeleted == true) {
            const blacklist_token = BlacklistToken.create({
              token: token,
            });
            return res.sendStatus(401);
          }
        }
        req.user = payload;
        next();
      });
    }
  });
};

module.exports = authToken;
