const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nodeuser:Yahama3026@node.ihfzbou.mongodb.net/devTinder?appName=node"
    );

    console.log("Database connected successfully");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    throw err; // ⭐ Important
  }
};

module.exports = connectDb;