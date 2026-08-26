const express = require("express");
const {userAuth} = require("../Middlewares/auth");
const { validateEditProfileData } = require("../utils/validation")
const User = require("../models/user");

const profieRouter = express.Router();

profieRouter.get("/profile", userAuth, async (req, res) => {
    try {
        res.status(200).json({
            message: "Profile fetched successfully",
            data: req.user
        });
    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({
            message: "Invalid token",
            error: error.message,
        });
    }
});


profieRouter.patch("/profile/update", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req);
        const loggedInUser = req.user;
        console.log("Logged", loggedInUser)
        console.log("Logged1", req.body)
        Object.keys(req.body).forEach((field) => {
            loggedInUser[field] = req.body[field];
        })

        await loggedInUser.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            data: loggedInUser
        })

    } catch (error) {
        console.error("Update user error:", error.message);
        res.status(400).json({
            message: error.message,
        });
    }
})

profieRouter.delete(
  "/profile",
  userAuth,
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user._id);

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        message: "Profile deleted successfully",
      });
    } catch (error) {
      console.error(
        "Profile deletion error:",
        error.message
      );

      return res.status(500).json({
        message: "Unable to delete profile",
      });
    }
  }
);

module.exports = profieRouter;