const createToken = (req) => {
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const UserLoginsList = await UserLogins.find({
      userId: req.auth.id,
      tokenDeleted: false,
      ipAddress: ip,
      device: req.headers["user-agent"],
    });

    UserLoginsList.forEach(async (logins) => {
      logins.tokenDeleted = true;
      await logins.save();
    });

    
    const tokenId =  await cid({ user_id : req.auth.id, date : Date.now(), randomLength: 4 });
    const token = await UserLoginsList.create({
      userId : req.auth.id,
      tokenId : tokenId,
      tokenSecret : await cid({ tokenSecret : ip, date : Date.now(), randomLength: 8 }),
      ip_address : ip ,
      device : req.headers["user-agent"]
    });


    const tokenUser = { id:req.auth.id , token_id: tokenId  };
    const accessToken = await jwt.sign(tokenUser, process.env.TOKEN_KEY);
    return accessToken;
}

module.exports = createToken;
