import express, { Application, Request, Response} from "express"
import { bookRouter } from "./app/controllers/books.controller";
import { borrowRouter } from "./app/controllers/borrow.controller";
import { notFoundHandler } from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";

const app: Application = express();
app.use(express.json())

//routes 

app.use('/api/books', bookRouter)
app.use("/api/borrow",borrowRouter)

app.get("/", (req, res)=>{
    res.status(200).json({
        success: true,
        message: "Welcome to the Library-Management Backend. Follow the required routes to see all the requests (/books , /borrow)"
    })
})


//error handlers
app.use(notFoundHandler)
app.use(globalErrorHandler)

export default app; 