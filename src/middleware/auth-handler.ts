import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import secret from "../config/secret-config";
import JWTService from "../service/jwt-service";
import response from "../utils/response-util";
import Address from "../modules/address/address-model";

const authHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header must be in the format: Bearer <token>",
      });
    }

    // Extract the token from the "Bearer" scheme
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify the token
    const jwtService = new JWTService();
    const { verifyAccessToken } = jwtService;

    const decode = verifyAccessToken(token);
    if (!decode) return response(res, 401, "Invalid access token or expired");
    const addressProfile = await Address.findOne({ address: decode.address });
    // req.user = addressProfile;

    next();
  } catch (error) {
    console.log(error);
    return response(res, 401, "JWT token Invalid");
  }
};

export default authHandler;
