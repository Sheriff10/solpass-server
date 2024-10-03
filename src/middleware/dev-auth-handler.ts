import { Request, Response, NextFunction } from "express";
import Developer from "../modules/developers/developer-model";
import JWTService from "../service/jwt-service";
import response from "../utils/response-util";

export const apikeyHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.header("solpass-api-key");
  if (!apiKey) {
    return res.status(401).json({ message: "API key is missing" });
  }

  const developer = await Developer.findOne({ "apikeys.key": apiKey });

  if (!developer)
    return res.status(401).json({
      message: "Unauthorized Access. Please Ensure your API key is valid",
    });

  next();
};

export const devAuthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["dev-authorization"];

    console.log(authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    if (!authHeader.toString().startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header must be in the format: Bearer <token>",
      });
    }

    const token = authHeader.toString().split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify the token
    const jwtService = new JWTService();
    const { verifyAccessToken } = jwtService;

    const decode = verifyAccessToken(token);
    if (!decode) return response(res, 401, "Invalid access token or expired");

    console.log(decode);

    // Store the decoded JWT in req.user
    req.user = decode; // `req.user` should now be recognized by TypeScript

    next();
  } catch (error) {
    console.log("Invalide JWT token");
    return response(res, 401, "JWT token Invalid");
  }
};
