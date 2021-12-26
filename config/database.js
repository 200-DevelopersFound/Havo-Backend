require("dotenv").config();
const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DATABASE CONNECTION SUCCESSFULL");
    })
    .catch((error) => {
      console.log("DATABASE CONNECTION FAILURE");
      console.error(error);
      process.exit(1);
    });
};
