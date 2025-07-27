"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
        type: String,
        required: true,
        enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]
    },
    isbn: { type: String, required: true, unique: true },
    description: String,
    copies: { type: Number, required: true },
    available: { type: Boolean, default: true },
}, {
    versionKey: false,
    timestamps: true
});
//pre-save hook
bookSchema.pre("save", function (next) {
    console.log(`Pre-save: Book titled "${this.title}" is about to be saved.`);
    next();
});
// Post-save hook
bookSchema.post("save", function (doc, next) {
    console.log(` Post-save: Book "${doc.title}" with ID ${doc._id} saved.`);
    next();
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
