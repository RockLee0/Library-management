"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const globalErrorHandler = (err, req, res, next) => {
    let message = "Something went wrong";
    let errorObject = {};
    // Handle Zod validation error
    if (err instanceof zod_1.ZodError) {
        message = "Validation failed";
        errorObject = {
            name: "ZodValidationError",
            errors: err.format(),
        };
    }
    // Handle Mongoose validation error
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        message = "Validation failed";
        errorObject = {
            name: "ValidationError",
            errors: err.errors,
        };
    } // Handle invalid ObjectId (CastError)
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
exports.default = globalErrorHandler;
