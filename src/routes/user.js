const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/user");
const { userAuth } = require("../Middlewares/auth");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const userRouter = express.Router();

/**
 * Get paginated user feed
 */
userRouter.get("/feed", userAuth, catchAsync(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const requestedLimit =
        Number.parseInt(req.query.limit, 10) || 10;

    if (page < 1) {
        return res.status(400).json({
            message: "Page must be greater than or equal to 1",
        });
    }

    if (requestedLimit < 1) {
        return res.status(400).json({
            message: "Limit must be greater than or equal to 1",
        });
    }

    const limit = Math.min(requestedLimit, 50);
    const skip = (page - 1) * limit;

    const filter = {
        _id: {
            $ne: req.user._id,
        },
    };

    const [users, totalUsers] = await Promise.all([
        User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
        message: "Feed fetched successfully",
        pagination: {
            currentPage: page,
            limit,
            totalUsers,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
        data: users,
    });

}));

/**
 * Get another user by MongoDB ID
 */

userRouter.get(
    "/user/:id",
    userAuth,
    catchAsync(async (req, res) => {
        const user = await User.findById(
            req.params.id
        ).select("-password");

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    })
);

userRouter.get("/users/search", userAuth, catchAsync(async (req, res) => {
    const { skill } = req.query;

    if (!skill || !skill.trim()) {
        throw new Error("Skill is required")
    }

    const normalizedSkill = skill.trim();

    const users = await User.find({ skills: normalizedSkill, _id: { $ne: req.user._id } }).select("firstName lastName age gender photoUrl about skills");

    return res.status(200).json({
        message: "Users fetched successfully",
        count: users.length,
        data: users
    })

}))

userRouter.get("/users/filter-by-age", userAuth, catchAsync(async (req, res) => {
    const { minAge, maxAge } = req.query;

    if (minAge === undefined || maxAge === undefined) {
        throw new AppError("minAge and maxAge are required", 400)
    }
    const minimumage = Number(minAge);
    const maximumAge = Number(maxAge);

    if (Number.isNaN(minimumage) || Number.isNaN(maximumAge)) {
        throw new AppError("minAge and maxAge must be valid numbers", 400)
    }

    if (minimumage < 0 || maximumAge < 0) {
        throw new AppError("minAge and maxAge cannot be negitive")
    }

    if (minimumage > maximumAge) {
        return res.status(401).json({
            message: "minAge cannot be greater than maxAge"
        })
    }

    const users = await User.find({ age: { $gte: minimumage, $lte: maximumAge }, _id: { $ne: req.user._id } }).select("firstName lastName age gender photoUrl about skills");

    return res.status(200).json({
        message: "Users fetched successfully",
        count: users.length,
        filters: {
            "minAge": minimumage,
            "maxAge": maximumAge
        },
        data: users
    })

}))

userRouter.get("/feed/smart", userAuth, catchAsync(async (req, res) => {
    const loggedInUserSkills = req.user.skills;
    if (loggedInUserSkills.length === 0 || !loggedInUserSkills) {
        throw new AppError("Add skills to your profile to view the smart feed", 400)
    }
    const users = await User.find({
        skills: { $in: loggedInUserSkills }, _id: { $ne: req.user._id }
    }).select("firstName lastName age gender photoUrl about skills").sort({createdAt : -1});

    return res.status(200).json({
        message : "Smart feed fetched successfully",
        count : users.length,
        data : users
    })
}))

module.exports = userRouter;