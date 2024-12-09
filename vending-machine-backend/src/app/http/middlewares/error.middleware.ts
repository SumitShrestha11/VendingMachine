import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response.util";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json(errorResponse(err.message || "Internal Server Error"));
};
