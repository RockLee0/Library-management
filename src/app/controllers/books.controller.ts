import z from "zod"
import express, { NextFunction, Request, Response } from "express"; 
import { Book } from "../models/books.model";


const zodBookShchema = z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    isbn: z.string(), //unique
    description: z.string().optional(),
    copies: z.number().int().nonnegative(),
    available: z.boolean()

})

const zodPartialBookSchema = zodBookShchema.partial();


export const bookRouter = express.Router()

//add a book
bookRouter.post("/",async(req:Request, res: Response , next: NextFunction)=>{
    try{
    
    const body =await zodBookShchema.parseAsync(req.body);
    const newBook = await Book.create(body)

    //response
      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: newBook
    })
    }
    catch(error){
        next (error)
    }

})

//see available books
bookRouter.get("/",async(req:Request, res: Response,next: NextFunction)=>{
    try{
  const genre= req.query.filter
  const field = req.query.sortBy?.toString() || " "
  const value = req.query.sort  
  const limitValue = req.query.limit? parseInt(req.query.limit.toString()) : 10;

  const filter: any = {};
  if (genre)
    {
      filter.genre = genre;
    } 
  console.log(filter,field)
  const allBook = await Book.find(filter).sort( field.trim() ? { [field]: value === 'asc' ? 1 : -1 } : {}).limit(limitValue);
  if (!allBook) {
      const error = new Error("Books not found");
      (error as any).status = 404;
      throw error;
    }
  //response
      res.status(201).json({
        success: true,
        message: "Books retrieved successfully",
        data: allBook
    })      

    }catch(error){
      next(error)
    }
})

//Get Book by ID
bookRouter.get("/:bookId",async(req:Request, res: Response, next: NextFunction)=>{
    try{
          const bookId = req.params.bookId
    const theBook = await Book.findById(bookId)
    if (!theBook) {
      const error = new Error("Book not found");
      (error as any).status = 404;
      throw error;
    }
    //response
      res.status(201).json({
        success: true,
        message: "Book retrieved successfully",
        data: theBook
    })
    } 
    catch(error){
      next(error)
    }
})

//Update Book
bookRouter.put("/:bookId",async(req:Request, res: Response, next: NextFunction)=>{ 
    try{
    const bookId = req.params.bookId
    console.log(bookId,req.body)
    const body =await zodPartialBookSchema.parseAsync(req.body)
    const theBook = await Book.findById(bookId)
    console.log(theBook,body)
    if (!theBook) {
      const error = new Error("Book not found");
      (error as any).status = 404; 
      throw error;
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, body, {new:true})
    console.log(updatedBook)

    //response
      res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook
    })
    }catch(error){
      next(error)
    }
})


//Delete Book
bookRouter.delete("/:bookId",async(req:Request, res: Response, next: NextFunction)=>{ 
    try{
    const bookId = req.params.bookId
    const theBook = await Book.findById(bookId)
    if (!theBook) {
      const error = new Error("Book not found");
      (error as any).status = 404;
      throw error;
    }   
    const updatedBook = await Book.findByIdAndDelete(bookId)

    //response
      res.status(201).json({
        success: true,
        message: "Book Deleted successfully",
        data: null
    })
    }catch(error){
      next(error)
    }
})