const UserLogins = require("../models/userLogin");
const customId = require("custom-id-new");
const jwt = require("jsonwebtoken");

const createToken = async (req) => {
  try {
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let UserLoginsList = await UserLogins.find({
      userId: req.auth.id,
      tokenDeleted: false,
      ipAddress: ip,
      device: req.headers["user-agent"],
    });

    UserLoginsList.forEach(async (logins) => {
      if (logins) {
        // single userID should be there
        logins.token_deleted = true;
        await logins.save();
      }
    });

    const tokenId = await customId({
      user_id: req.auth.id,
      date: Date.now(),
      randomLength: 4,
    });
    const token = await UserLogins.create({
      userId: req.auth.id,
      tokenId: tokenId,
      tokenSecret: await customId({
        tokenSecret: ip,
        date: Date.now(),
        randomLength: 8,
      }),
      ipAddress: ip,
      device: req.headers["user-agent"],
    });
    await token.save();
    const tokenUser = { id: req.auth.id, token_id: tokenId };
    const accessToken = await jwt.sign(tokenUser, process.env.TOKEN_KEY);
    return accessToken;
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = createToken;
