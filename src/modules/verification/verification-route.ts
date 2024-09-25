import { Router } from "express";
import { createVerification } from "./verification-controller";
import authHandler from "../../middleware/auth-handler";

const verificationRouter = Router();

// verificationRouter.use(authHandler);
verificationRouter.post("/", createVerification);

export default verificationRouter;
