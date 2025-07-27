"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
};
exports.notFoundHandler = notFoundHandler;
