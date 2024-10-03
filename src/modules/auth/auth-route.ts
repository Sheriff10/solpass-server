import { Router } from "express";
import {
  loginAddress,
  loginDeveloper,
  refreshAccessToken,
  signupDeveloper,
} from "./auth-controller";
import authHandler from "../../middleware/auth-handler";

const authRoute = Router();

authRoute.post("/login", loginAddress);
authRoute.post("/refresh", refreshAccessToken);
authRoute.post("/dev/login", loginDeveloper);
authRoute.post("/dev/signup", signupDeveloper);

export default authRoute;
