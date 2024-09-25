import { Router } from "express";
import { loginAddress, refreshAccessToken } from "./auth-controller";

const authRoute = Router();

authRoute.post("/login", loginAddress);
authRoute.post("/refresh", refreshAccessToken);

export default authRoute;
