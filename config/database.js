require("dotenv").config();
const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

// const { MongoClient } = require("mongodb");
// const uri = "mongodb+srv://DevelopersFound:<password>@cluster0.qcimj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    })
    .then(() => {
      console.log("DATABASE CONNECTION SUCCESSFULL");
    })
    .catch((error) => {
      console.log("DATABASE CONNECtiON FAILURE");
      console.error(error);
      process.exit(1);
    });
};
