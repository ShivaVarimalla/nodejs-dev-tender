const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Weak Password");
        }
      },
    },

    age: {
      type: Number,
      min: 18,
      max: 100,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    photoUrl: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },

    about: {
      type: String,
      maxlength: 300,
      default: "This is your default",
    },

    skills: {
      type: [String],
      validate(value) {
        return value.length <= 10;
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
