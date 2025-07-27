// middleware/globalErrorHandler.ts
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let message = "Something went wrong";
  let errorObject: any = {};

  // Handle Zod validation error
  if (err instanceof ZodError) {
    message = "Validation failed";
    errorObject = {
      name: "ZodValidationError",
      errors: err.format(),
    };
  }
  // Handle Mongoose validation error
  else if (err instanceof mongoose.Error.ValidationError) {
    message = "Validation failed";
    errorObject = {
      name: "ValidationError",
      errors: err.errors,
    };
  }// Handle invalid ObjectId (CastError)
else if (err.name === "CastError") {
  message = "Validation failed";
  errorObject = {
    name: "ValidationError",
    errors: {
      [err.path]: {
        message: `Invalid ${err.path}`,
        name: "ValidatorError",
        kind: err.kind,
        path: err.path,
        value: err.value,
      },
    },
  };
}
  // Handle 404 (Not Found) or custom error
  else if (err.status === 404) {
    message = err.message || "Not Found";
    errorObject = {
      name: "NotFoundError",
      path: req.originalUrl,
    };
  }

  // Handle all other errors
  else {
    message = err.message || message;
    errorObject = {
      name: err.name || "Error",
      stack: err.stack,
    };
  }

  res.status(err.status || 500).json({
    message,
    success: false,
    error: errorObject,
  });
};

export default globalErrorHandler;
