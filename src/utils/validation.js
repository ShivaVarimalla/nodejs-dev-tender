const validator = require("validator");

const validateSignUpData = (req) => {
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "emailId",
    "password",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const requestFields = Object.keys(req.body);

  const invalidFields = requestFields.filter(
    (field) => !ALLOWED_FIELDS.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error(
      `Invalid fields in request body: ${invalidFields.join(", ")}`
    );
  }

  const { firstName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("firstName is required");
  }

  if (!emailId) {
    throw new Error("emailId is required");
  }

  if (!password) {
    throw new Error("password is required");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
  }
};

const validateEditProfileData = (req) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const updateFields = Object.keys(req.body);

  if (updateFields.length === 0) {
    throw new Error("Provide at least one field to update");
  }

  const invalidFields = updateFields.filter(
    (field) => !ALLOWED_UPDATES.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error(
      `These fields cannot be updated: ${invalidFields.join(", ")}`
    );
  }
};


const validateLoginData = (req) => {
  const ALLOWED_FIELDS = ["emailId", "password"];

  const requestFields = Object.keys(req.body);

  // Check for an empty request body
  if (requestFields.length === 0) {
    throw new Error("Request body cannot be empty");
  }

  // Find fields that are not allowed
  const invalidFields = requestFields.filter(
    (field) => !ALLOWED_FIELDS.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error(
      `Invalid fields in request body: ${invalidFields.join(", ")}`
    );
  }

  const { emailId, password } = req.body;

  if (!emailId) {
    throw new Error("emailId is required");
  }

  if (!password) {
    throw new Error("password is required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateLoginData,
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateLoginData,
};