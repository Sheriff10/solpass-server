import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { CustomHttpError } from "../custom-errors";
import secret from "../config/secret-config";
import { AxiosError } from "axios";

const { CastError, ValidationError } = MongooseError;

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  if (error instanceof CustomHttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  if (error instanceof CastError) {
    const path = error.path === "_id" ? "id" : error.path;
    const message = `${path} expected ${error.kind}`;
    return res.status(400).json({ message });
  }
  if (error instanceof AxiosError) {
    const message = `${error.message} \n ${error.stack}`;
    return res.status(400).json({ message });
  }
  // @ts-expect-error
  if (error.code === 11000) {
    // @ts-expect-error
    const message = `${Object.keys(error.keyValue)} already exists`;
    return res.status(400).json({ message });
  }
  /*
    For server errors,
    return the error in development.
    This allows for the error to be viewed
    and prevent having to come back to the console to view the error
  */
  if (secret.NODE_ENV === "development") {
    return res.status(500).json({ error, message: error.message });
  }
  return res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;
