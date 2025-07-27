import express, { Application } from "express"
import { bookRouter } from "./app/controllers/books.controller";
import { borrowRouter } from "./app/controllers/borrow.controller";
import { notFoundHandler } from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";

const app: Application = express();
app.use(express.json())

//routes 
app.use('/books', bookRouter)
app.use("/borrow",borrowRouter)


//error handlers
app.use(notFoundHandler)
app.use(globalErrorHandler)

export default app; 