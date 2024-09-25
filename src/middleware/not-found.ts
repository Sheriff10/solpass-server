import { NextFunction, Request, Response } from "express";

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({ message: "Route does not exists" });
};

export default routeNotFound;
