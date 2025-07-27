# 📖 Library Management API

A backend REST API built using **Express**, **TypeScript**, and **MongoDB (Mongoose)** to manage a library system — allowing users to add, retrieve, update, delete, and borrow books, complete with proper validation, business logic, aggregation pipelines, and more.

---

## 🎯 Objective

Design and implement a Library Management System with:

- 📌 Schema validation (Zod + Mongoose)
- 📌 Business rules (e.g., availability control when borrowing)
- 📌 Aggregation pipelines (borrowed book summaries)
- 📌 Mongoose static & instance methods
- 📌 Middleware (`pre`, `post`)
- 📌 Filtering, sorting, limiting support

---

## 📦 Tech Stack

- **Backend:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Validation:** Zod
- **Tooling:** Nodemon, dotenv, ts-node-dev

---

## 📚 Book Model

| Field        | Type    | Validation / Notes                                  |
|--------------|---------|-----------------------------------------------------|
| title        | string  | Required                                             |
| author       | string  | Required                                             |
| genre        | string  | Required — Enum: `FICTION`, `NON_FICTION`, `SCIENCE`, etc. |
| isbn         | string  | Required & Unique                                   |
| description  | string  | Optional                                             |
| copies       | number  | Required, must be ≥ 0                               |
| available    | boolean | Defaults to `true`                                  |

---

## 🔄 Borrow Model

| Field   | Type     | Validation / Notes                       |
|---------|----------|------------------------------------------|
| book    | ObjectId | Required — references Book               |
| quantity| number   | Required — must be a positive integer    |
| dueDate | date     | Required                                  |

---

## 📌 API Endpoints

### ✅ Create Book

`POST /api/books`

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5
}
📚 Get All Books
GET /api/books?filter=SCIENCE&sortBy=createdAt&sort=desc&limit=5

Supports:

Genre filtering

Sorting by any field

Limit & pagination

🔍 Get Book by ID
GET /api/books/:bookId

✏️ Update Book
PUT /api/books/:bookId

json
Copy
Edit
{
  "copies": 50
}
❌ Delete Book
DELETE /api/books/:bookId

📘 Borrow a Book
POST /api/borrow

Business logic:

Rejects if not enough copies

Deducts copies

Sets available: false if copies reach 0 (via instance method)

json
Copy
Edit
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
📊 Borrow Summary
GET /api/borrow

Returns:

json
Copy
Edit
[
  {
    "book": {
      "title": "The Theory of Everything",
      "isbn": "9780553380163"
    },
    "totalQuantity": 5
  }
]
❗ Error Response Format
json
Copy
Edit
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "kind": "min"
      }
    }
  }
}
Handled errors:

❌ Zod validation

❌ Mongoose schema errors

❌ Resource not found

❌ Unexpected internal errors

🧠 Mongoose Features Used
✅ Static Method: Book.updateAvailability()

✅ Instance Method: book.updateAvailability()

✅ Pre & Post Middleware: Logging and state checks

🧪 Sample Data
json
Copy
Edit
{
  "title": "1984",
  "author": "George Orwell",
  "genre": "FICTION",
  "isbn": "9780451524935",
  "description": "Dystopian novel",
  "copies": 3
}
📦 Setup Locally
bash
Copy
Edit
git clone https://github.com/your-username/library-management-api.git
cd library-management-api
npm install
Create .env:

ini
Copy
Edit
PORT=5000
MONGODB_URI=mongodb://localhost:27017/libraryDB
Run server:

bash
Copy
Edit
npm run dev
✅ Project Highlights
 Schema validation via Zod and Mongoose

 Business logic for availability & borrowing

 Aggregation summary endpoint

 Filtering, sorting, limiting

 Reusable error response structure

 Static & instance methods

 Middleware (pre, post)

🏆 Bonus Section (10 Marks)
✨ Clean code structure & readable types

📁 Layered folder organization

🧪 Tested with Postman

🎥 Video demo (optional)

📖 This professional README!

📸 Demo / Video Link
🔗 [Insert your demo video link here]

🌐 Deployment
Live API: https://your-api-url.com
Or test locally with Postman.

📩 Contact
Author: Your Name
GitHub: @your-username
Email: you@example.com

