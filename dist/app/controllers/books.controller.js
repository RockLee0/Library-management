"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const zodBookShchema = zod_1.default.object({
    title: zod_1.default.string(),
    author: zod_1.default.string(),
    genre: zod_1.default.string(),
    isbn: zod_1.default.string(), //unique
    description: zod_1.default.string().optional(),
    copies: zod_1.default.number().int().nonnegative(),
    available: zod_1.default.boolean()
});
const zodPartialBookSchema = zodBookShchema.partial();
exports.bookRouter = express_1.default.Router();
//add a book
exports.bookRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield zodBookShchema.parseAsync(req.body);
        const newBook = yield books_model_1.Book.create(body);
        //response
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: newBook
        });
    }
    catch (error) {
        next(error);
    }
}));
//see available books
exports.bookRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const genre = req.query.filter;
        const field = ((_a = req.query.sortBy) === null || _a === void 0 ? void 0 : _a.toString()) || " ";
        const value = req.query.sort;
        const limitValue = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
        const filter = {};
        if (genre) {
            filter.genre = genre;
        }
        console.log(filter, field);
        const allBook = yield books_model_1.Book.find(filter).sort(field.trim() ? { [field]: value === 'asc' ? 1 : -1 } : {}).limit(limitValue);
        if (!allBook) {
            const error = new Error("Books not found");
            error.status = 404;
            throw error;
        }
        //response
        res.status(201).json({
            success: true,
            message: "Books retrieved successfully",
            data: allBook
        });
    }
    catch (error) {
        next(error);
    }
}));
//Get Book by ID
exports.bookRouter.get("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const theBook = yield books_model_1.Book.findById(bookId);
        if (!theBook) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }
        //response
        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data: theBook
        });
    }
    catch (error) {
        next(error);
    }
}));
//Update Book
exports.bookRouter.put("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        console.log(bookId, req.body);
        const body = yield zodPartialBookSchema.parseAsync(req.body);
        const theBook = yield books_model_1.Book.findById(bookId);
        console.log(theBook, body);
        if (!theBook) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }
        const updatedBook = yield books_model_1.Book.findByIdAndUpdate(bookId, body, { new: true });
        console.log(updatedBook);
        //response
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook
        });
    }
    catch (error) {
        next(error);
    }
}));
//Delete Book
exports.bookRouter.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const theBook = yield books_model_1.Book.findById(bookId);
        if (!theBook) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }
        const updatedBook = yield books_model_1.Book.findByIdAndDelete(bookId);
        //response
        res.status(201).json({
            success: true,
            message: "Book Deleted successfully",
            data: null
        });
    }
    catch (error) {
        next(error);
    }
}));
