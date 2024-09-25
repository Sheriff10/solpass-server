import jwt, { JwtPayload } from "jsonwebtoken";
import secret from "../config/secret-config";

const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = secret;

class JWTService {
  private refreshKey: string;
  private accessKey: string;

  constructor() {
    this.accessKey = JWT_ACCESS_KEY;
    this.refreshKey = JWT_REFRESH_KEY;
  }

  // Method to create an access token
  createAccessToken = (payload: JwtPayload | string): string => {
    try {
      const token = jwt.sign(payload, this.accessKey, {
        expiresIn: "1h",
      });
      return token;
    } catch (error) {
      console.error("Error creating access token:", error);
      throw new Error("Failed to create access token");
    }
  };

  // Method to create a refresh token
  createRefreshToken = (payload: JwtPayload | string): string => {
    try {
      const token = jwt.sign(payload, this.refreshKey, {
        expiresIn: "7d",
      });
      return token;
    } catch (error) {
      console.error("Error creating refresh token:", error);
      throw new Error("Failed to create refresh token");
    }
  };

  // Method to verify an access token
  verifyAccessToken = (token: string): JwtPayload | null => {
    try {
      // Verifies the token using the accessKey
      const decoded = jwt.verify(token, this.accessKey);
      if (typeof decoded === "string") {
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Error verifying access token:", error);
      throw new Error("Invalid or expired access token");
    }
  };

  // Method to verify a refresh token
  verifyRefreshToken = (token: string): JwtPayload | null => {
    try {
      // Verifies the token using the refreshKey
      const decoded = jwt.verify(token, this.refreshKey);
      if (typeof decoded === "string") {
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Error verifying refresh token:", error);
      throw new Error("Invalid or expired refresh token");
    }
  };
}

export default JWTService;
