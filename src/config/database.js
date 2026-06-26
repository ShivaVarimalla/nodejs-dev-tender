const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    await mongoose.connect(
      process.env.DB_CONNECTION_STRING
    );
  } catch (error) {
    console.log("DB coneection error", error);
  }
};

module.exports = connectDb