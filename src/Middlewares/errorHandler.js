const errorHandler = (error, req, res, next) => {
  console.error("Application error:", error);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong";

  // Mongoose validation error
  if (error.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // Invalid MongoDB ObjectId
  if (error.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  }

  // Duplicate MongoDB key
  if (error.code === 11000) {
    statusCode = 409;

    const duplicateField = Object.keys(
      error.keyValue || {}
    )[0];

    message = duplicateField
      ? `${duplicateField} already exists`
      : "Duplicate value already exists";
  }

  // Invalid JWT
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  // Expired JWT
  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please log in again";
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;