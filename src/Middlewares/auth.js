const User = require("../models/user");
const jwt = require("jsonwebtoken");
2

const adminAuth = (req, res, next) => {
  const token = "abcd";
  const isAuthorizied = token === "abcd";
  if (!isAuthorizied) {
    res.status(401).send("Unauthorizied User");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Token not found"
      })
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found"
      })
    }
    req.user = user;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired. Please log in again"
        : "Invalid authentication token";
    return res.status(401).json({
      message
    })
  }
}

module.exports = {
  adminAuth, userAuth
};
