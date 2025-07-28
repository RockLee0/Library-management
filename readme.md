# 📚 Library Management System API

A Library Management System API built using **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and **Zod** for managing a library's collection of books. It allows you to add, update, delete, and retrieve book information with proper validation and error handling.

### Server : https://library-management-virid-two.vercel.app/
### All Books : https://library-management-virid-two.vercel.app/api/books
### Borrow book summery : https://library-management-virid-two.vercel.app/api/borrow

## 🚀 Features

- 📘 Add a new book with validation (Zod, mongoose)
- 📗 Update any book property (partial update supported)
- 📕 Delete a book by ID
- 📙 Get all books or a specific book by ID
- ✅ Zod schema validation with detailed error messages
- 🛠 Mongoose model with enums, timestamps, and uniqueness constraints
- 🔁 Mongoose middleware for logging changes
- 🧠 Custom instance and static methods on Book model
- 🌐 JSON-based API ready for frontend integration


## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- Zod for validation
- TypeScript (Optional based on your setup)


## 📦 Setup Instructions

### 1. Clone the repository
git clone https://github.com/RockLee0/library-management.git
cd library-management

### 2. Install dependencies
npm install

### 3. Create a .env file
PORT=5000
MONGODB_URI=mongodb://localhost:27017/libraryDB

### 4. Start the server
npm run dev
The server will start at http://localhost:5000

📨 Sample API Requests

➕ Add a Book

POST: http://localhost:5000/api/books


🛠 Update a Book

PUT: http://localhost:5000/api/books/:id

ex: {
  "copies": 10
}


❌ Delete a Book
DELETE: http://localhost:5000/api/books/:id



✅ Zod Validation Example

1.All fields are validated.
2.Friendly error messages for:
3.Missing fields
4.Wrong data types
5.Invalid enum values
6.Duplicate ISBN




📚 Book Model Schema


{
  title: string,
  author: string,
  genre: "FICTION" | "NON_FICTION" | "SCIENCE" | "HISTORY" | "BIOGRAPHY" | "FANTASY",
  isbn: string (unique),
  description?: string,
  copies: number,
  available?: boolean (default: true)
}




🧠 Advanced Features

1.Mongoose Middleware
2.Logs a message after saving any book.
3.All have pre and post hook where you will be notified in console before and after creating data


### Contribution
Feel free to fork the repo and open pull requests. Open issues if you face any problems.
