require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("./config/database");
const User = require("./models/user");
const {
  validateSignUpData,
  validateEditProfileData,
  validateLoginData,
} = require("./utils/validation");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./Middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Up",
    message: "Server is running fine",
    timeStamp: new Date().toISOString(),
  });
});

/**
 * Create user
 */
app.post("/signup", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Signup error:", error.message);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email ID already exists",
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    validateLoginData(req);
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const normalizedEmail = emailId.trim().toLowerCase();
    const user = await User.findOne({ emailId: normalizedEmail });

    if (!user) {
      console.log("user");
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
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
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
});

/**
 * Get user by email query parameter
 * Example: GET /user?emailId=test@example.com
 */
app.get("/user", async (req, res) => {
  try {
    const emailId = req.query.emailId;

    if (!emailId) {
      return res.status(400).json({
        message: "Email ID is required",
      });
    }

    const normalizedEmail = emailId.trim().toLowerCase();
    const user = await User.findOne({ emailId: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error.message);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.get("/profile", userAuth, async (req, res) => {
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


/**
 * Get user by MongoDB ID
 * Example: GET /user/66e1c6934c3e6a579ff135a3
 */
app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error.message);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

/**
 * Update user by MongoDB ID
 * Example: PATCH /user/66e1c6934c3e6a579ff135a3
 */
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    validateEditProfileData(req);

    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
});

/**
 * Delete user by MongoDB ID
 * Example: DELETE /user/66e1c6934c3e6a579ff135a3
 */
app.delete("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error.message);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.patch("/profile/update", userAuth, async (req, res) => {
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

app.post("/logout", userAuth, async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.JWT_SECRET === "Production",
    sameSite: "strict"
  })
  return res.status(200).json({
    message: "User logged out successfully"
  })
});

/**
 * Get all users
 */
app.get("/feed", userAuth, async (req, res)=>{
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const requestedLimit = parseInt(req.query.limit, 10) || 10;

    if(page < 1){
      return res.status(400).json({
        message : "Page must be at least 1"
      })
    }
    if(requestedLimit < 1){
      return res.status(400).json({
        message : "Limit must be at least 1"
      })
    }
    
    const limit = Math.min(requestedLimit, 50);
    const skip = (page-1) * limit;

    const filter = {
      _id : {$ne : req.user._id}
    }

    const users = await User.find(filter).select("-password").sort({createdAt : -1}). skip(skip).limit(limit);
    
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers/ limit);



    return res.status(200).json({
      message : "Feed fetched successfully",
      pagination:{
        currentPage : page,
        limit,
        totalUsers,
        totalPages,
        hasNextPage : page < totalPages,
        hasPreviousPage : page > 1
      },
      data : users
    })
  } catch (error) {
    console.log("Feed error", error);

    return res.status(500).json({
      message : "Unable fetch feed"
    })
  }
})

const PORT = process.env.PORT || 7777;

connectDB()
  .then(() => {
    console.log("DB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server has started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection error:", error.message);
    process.exit(1);
  });
