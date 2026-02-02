import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errorHandling";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  const isProd = process.env.NODE_ENV === "production";
  return res
    .status(500)
    .json({ message: isProd ? {} : "Internal server error" });
}
