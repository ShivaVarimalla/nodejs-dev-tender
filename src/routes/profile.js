const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const { validateEditProfileData } = require("../utils/validation")
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

const profieRouter = express.Router();

profieRouter.get("/profile", userAuth, catchAsync(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: req.user
    });
}));


profieRouter.patch("/profile/update", userAuth, catchAsync(async (req, res) => {
    validateEditProfileData(req);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((field) => {
        loggedInUser[field] = req.body[field];
    })

    await loggedInUser.save();

    return res.status(200).json({
        message: "Profile updated successfully",
        data: loggedInUser
    })

}))

profieRouter.delete(
    "/profile",
    userAuth,
    catchAsync(async (req, res) => {
        await User.findByIdAndDelete(req.user._id);

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Profile deleted successfully",
        });
    })
);

module.exports = profieRouter;