require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");

const connectDB = require("./config/database");
const User = require("./models/user");
const {
  validateSignUpData,
  validateEditProfileData,
} = require("./utils/validation");


const app = express();

app.use(express.json());

/**
 * Create user
 */
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { password, ...userData } = req.body;

    const passwordHash = await bycrypt.hash(password, 10);

    const user = new User({ ...userData, password: passwordHash });

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

    res.status(400).json({
      message: error.message,
    });
  }
});

app.post("/login", async (req, res) =>{
  try {
    const {emailId, password} = req.body;

    if(!emailId || !password) {
      return  res.status(400).json({
        message: "Email and password are required"
      })
    }
    const user = await User.findOne({emailId});

    if(!user){
      return res.status(400).json({
        message: "Invalid email or password"
      })
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password"
      })
    }

    res.status(200).json({
      message: "Login successful",
      data:{
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId
      }
    })
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Something went wrong"
    })
  }
})



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

    const user = await User.findOne({ emailId });

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

/**
 * Get all users
 */
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Feed error:", error.message);

    res.status(500).json({
      message: "Something went wrong",
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

    const user = await User.findByIdAndUpdate(
      userId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

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