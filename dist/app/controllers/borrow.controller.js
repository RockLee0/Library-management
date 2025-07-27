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
exports.borrowRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const books_model_1 = require("../models/books.model");
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRouter = express_1.default.Router();
const borroZodSchema = zod_1.default.object({
    book: zod_1.default.string().min(1, { message: "Book ID is required" }),
    quantity: zod_1.default.number().min(1, { message: "Quantity must be a positive number" }),
    dueDate: zod_1.default
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    })
        .transform((val) => new Date(val))
});
//routes
//add to borrow
exports.borrowRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield borroZodSchema.parseAsync(req.body);
        // retrive the book document
        const particularBook = yield books_model_1.Book.findById({ _id: body.book }); //the book
        console.log(particularBook);
        // if not found
        if (!particularBook) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }
        // check if copies > quantity
        if (particularBook.copies >= body.quantity) {
            const remainingCopies = particularBook.copies - body.quantity;
            const update = yield books_model_1.Book.findByIdAndUpdate(body.book, { copies: remainingCopies });
            if (remainingCopies == 0) {
                const update = yield books_model_1.Book.findByIdAndUpdate(body.book, { available: false });
            }
            const newBorrowedBook = yield borrow_model_1.Borrow.create(body);
            //response
            res.status(201).json({
                success: true,
                message: "Books borrowed successfully",
                data: newBorrowedBook
            });
        }
        else {
            const error = new Error("Not enough copies available");
            error.status = 400;
            throw error;
        }
    }
    catch (error) {
        next(error);
    }
}));
//Borrowed Books Summary 
exports.borrowRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowBookSummery = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                $unwind: "$bookDetails"
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn"
                    },
                    totalQuantity: 1
                }
            }
        ]);
        if (!borrowBookSummery) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }
        const formatted = borrowBookSummery.map(item => ({
            book: item.book,
            totalQuantity: item.totalQuantity
        }));
        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: formatted
        });
    }
    catch (error) {
        next(error);
    }
}));
