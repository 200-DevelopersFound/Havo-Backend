const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) return res.status(403).send("TOKEN FOUND");

  try {
    req.user = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    return res.status(401).send("INVALID TOKEN");
  }
  return next();
};

module.exports = authToken;
