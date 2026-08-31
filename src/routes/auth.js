
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { userAuth } = require('../Middlewares/auth');

const { validateSignUpData, validateLoginData } = require("../utils/validation");
const catchAsync = require("../utils/catchAsync");

const authRouter = express.Router();

authRouter.post("/signup", catchAsync(async (req, res) => {
    validateSignUpData(req);
    const { password, emailId, ...userData } = req.body;

    const normalizedEmail = emailId.trim().toLowerCase();

    const isEmailExists = await User.findOne({ emailId: normalizedEmail });
    if (isEmailExists) {
        return res.status(409).json({
            message: "Email ID already exists",
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        ...userData,
        emailId: normalizedEmail,
        password: passwordHash,
    });

    await user.save();

    res.status(201).json({
        message: "User data added successfully",
        data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
        },
    });
}));

authRouter.post("/login", catchAsync(async (req, res) => {
    validateLoginData(req);
    const { emailId, password } = req.body;

    if (!emailId || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }
    const normalizedEmail = emailId.trim().toLowerCase();
    const user = await User.findOne({ emailId: normalizedEmail }).select("+password");

    if (!user) {
        console.log("user");
        return res.status(400).json({
            message: "Invalid credentials",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
        res.cookie("token", token);
    } else {
        return res.status(400).json({
            message: "Invalid credentials",
        });
    }

    res.status(200).json({
        message: "Login successful",
        data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
        },
    });

}));

authRouter.post("/logout", userAuth, catchAsync(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "Production",
        sameSite: "strict"
    })
    return res.status(200).json({
        message: "User logged out successfully"
    })
}));

module.exports = authRouter;