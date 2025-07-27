// middleware/notFound.ts
import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Route not found");
  (error as any).status = 404;
  next(error);
};
