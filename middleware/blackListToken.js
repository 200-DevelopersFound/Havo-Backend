const jwt = require("jsonwebtoken");
const UserLogin = require("../models/userLogin");
const Blacklist = require("../models/blacklistToken");

const blacklistToken = (req, res, next) => {
  /* #swagger.responses[401] = {  schema: { error: "Token BlackListed" }, description: 'Unauthorized' } */
  /* #swagger.responses[403] = {  schema: { error: "Forbidden" }, description: 'Forbidden' } */

  const authHeader = req.headers["authorization"];

  // const bearer = authHeader && authHeader.split(" ")[0];
  // if (bearer != "Bearer") return res.sendStatus(401);

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  Blacklist.findOne({ token: token }).then((found) => {
    if (found) {
      jwt.verify(token, process.env.TOKEN_KEY, async (user, payload) => {
        const login = await UserLogin.findOne({
          userId: payload.id,
          tokenId: payload.token_id,
        });
        login.loggedOut = true;
        login.tokenDeleted = true;
        await login.save();
      });
      return res
        .status(401)
        .json({ Status: "Failure", message: "Token Blacklisted" });
    } else {
      jwt.verify(token, process.env.TOKEN_KEY, async (err, payload) => {
        if (err)
          // res.sendStatus(401);
          return res.status(403).json({ error: "Forbidden" });
        if (payload) {
          const userLogin = await UserLogin.findOne({
            userId: payload.id,
            tokenId: payload.token_id,
          });

          if (userLogin.tokenDeleted) {
            userLogin.loggedOut = true;
          } else {
            userLogin.loggedOut = true;
            userLogin.tokenDeleted = true;
          }

          await userLogin.save();
          const blacklistToken = Blacklist.create({ token: token });
        }
        next();
      });
    }
  });
};

module.exports = blacklistToken;
