import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any; // or use a more specific type based on your payload structure
    }
  }
}
