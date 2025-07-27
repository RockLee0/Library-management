"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./app/controllers/books.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const notFound_1 = require("./app/middleware/notFound");
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
//routes 
app.use('/books', books_controller_1.bookRouter);
app.use("/borrow", borrow_controller_1.borrowRouter);
//error handlers
app.use(notFound_1.notFoundHandler);
app.use(globalErrorHandler_1.default);
exports.default = app;
