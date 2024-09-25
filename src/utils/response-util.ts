import { Response } from "express";

const response = (
  res: Response,
  status: number,
  message?: any,
  info?: string
) => {
  return res.status(status).send({ message, info });
};

export function errorResponse(res: Response, message?: string) {
  return res
    .status(500)
    .send({ error: message ? message : "Internal Server Error" });
}

export function badReqResponse(res: Response, message?: string) {
  return res.status(400).send({ error: message ? message : "Bad request" });
}

export function notFoundResponse(res: Response, message?: string) {
  return res.status(404).send({ error: message ? message : "Not Found" });
}

export default response;
