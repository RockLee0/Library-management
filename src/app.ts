import express, { Application, Request, Response} from "express"
import { bookRouter } from "./app/controllers/books.controller";
import { borrowRouter } from "./app/controllers/borrow.controller";
import { notFoundHandler } from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import cors from "cors";

const app: Application = express();


app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-domain.com"], // whitelist
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


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