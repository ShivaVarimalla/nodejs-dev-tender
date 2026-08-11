const mongoose = require("mongoose");

const connectDB = async () => {
  const connectionString = process.env.DB_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("DB_CONNECTION_STRING is missing");
  }

  await mongoose.connect(connectionString);
};

module.exports = connectDB;