import express, { NextFunction, Request, Response } from "express"
import z, { ZodError } from "zod"
import { Book } from "../models/books.model"
import { Borrow } from "../models/borrow.model"

export const borrowRouter = express.Router()


const borroZodSchema = z.object({
  book: z.string().min(1, { message: "Book ID is required" }),
  quantity: z.number().min(1, { message: "Quantity must be a positive number" }),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
    })
    .transform((val) => new Date(val))
})


//routes

//add to borrow
borrowRouter.post("/",async(req:Request, res:Response,next: NextFunction)=>{
    try{
    const body = await borroZodSchema.parseAsync(req.body)
   
    // retrive the book document
    const particularBook =await Book.findById({_id: body.book}) //the book
    console.log(particularBook)
    
    // if not found
    if (!particularBook) {
      const error = new Error("Book not found");
      (error as any).status = 404;
      throw error;
    }

    // check if copies > quantity
    if (particularBook.copies >= body.quantity){
        const remainingCopies =  particularBook.copies - body.quantity;
        const update = await Book.findByIdAndUpdate(body.book, {copies : remainingCopies})  
        if (remainingCopies == 0){
            const update = await Book.findByIdAndUpdate(body.book, {available : false})
        }
        const newBorrowedBook = await Borrow.create(body)
            //response
      res.status(201).json({
        success: true,
        message: "Books borrowed successfully",
        data: newBorrowedBook
    })
    }
    else {
      const error = new Error("Not enough copies available");
      (error as any).status = 400;
      throw error;
    }       
    

    }
    
    catch(error){
    next(error);
  }



    })

//Borrowed Books Summary 
borrowRouter.get("/", async(req:Request, res: Response ,next: NextFunction)=>{
    try{
    const borrowBookSummery = await Borrow.aggregate([
        {
            $group:{
                _id: "$book",
                totalQuantity: {$sum: "$quantity"}
            }
        },
        {
            $lookup:{
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
                _id:0,
                 book: {
                    title: "$bookDetails.title",
                    isbn: "$bookDetails.isbn"
                       },
                totalQuantity: 1
                    }

        }
        
    ])
    if (!borrowBookSummery) {
      const error = new Error("Book not found");
      (error as any).status = 404;
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
    })
    }catch(error){
      next(error)
    }
})