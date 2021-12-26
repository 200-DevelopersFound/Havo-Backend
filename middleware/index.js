const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklistToken");
const UserLogin = require("../models/userLogin");

const authToken = async (req, res, next) => {
  /* 
  #swagger.responses[401] = {  schema: { error: "Token BlackListed" }, description: 'Unauthorized' }
  #swagger.responses[403] = {  schema: { error: "Forbidden" }, description: 'Forbidden' }
  */
  const authHeader = req.headers["authorization"];

  // const bearer = authHeader && authHeader.split(" ")[0];
  // if (bearer != "Bearer") return res.sendStatus(401);

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "Unauthorized" });

  // const dbUser = await User.findOne({ email });
  BlacklistToken.findOne({ token }).then((tokenFound) => {
    if (tokenFound) {
      return res.status(401).json({ error: "Token blacklisted." });
    } else {
      jwt.verify(token, process.env.TOKEN_KEY, async (err, payload) => {
        if (err) return res.status(403).json({ error: "Forbidden" });
        if (payload) {
          const login = await UserLogin.findOne({
            userId: payload.id,
            tokenId: payload.token_id,
          });
          if (login.tokenDeleted == true) {
            const blacklist_token = await BlacklistToken.create({
              token: token,
            });
            return res.status(401).json({ error: "Token Blacklisted." });
          }
        }
        req.user = payload;
        next();
      });
    }
  });
};

module.exports = authToken;
