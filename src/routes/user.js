const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/user");
const { userAuth } = require("../Middlewares/auth");

const userRouter = express.Router();

/**
 * Get paginated user feed
 */
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Feed error:", error.message);

    return res.status(500).json({
      message: "Unable to fetch feed",
    });
  }
});

/**
 * Get another user by MongoDB ID
 */
userRouter.get("/user/:id", userAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error.message);

    return res.status(500).json({
      message: "Unable to fetch user",
    });
  }
});

module.exports = userRouter;