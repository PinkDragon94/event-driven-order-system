import { NextFunction, Request, Response } from "express";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const message = error instanceof Error ? error.message : "Internal Server Error";
  const statusCode =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    (error as { message: string }).message.startsWith("Invalid status transition")
      ? 400
      : 500;

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined
  });
};
