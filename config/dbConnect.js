const mongoose = require("mongoose");

const dbConnection = () => { mongoose
  .connect(process.env.DB_URI)
  .then((conn) => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to mongoDB");
    process.exit(1);
  });
}

module.exports = dbConnection

