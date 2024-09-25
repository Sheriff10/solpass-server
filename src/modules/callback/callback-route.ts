import { Router } from "express";
import { handleCallback } from "./callback-controller";

const callbackRouter = Router();

callbackRouter.post("/", handleCallback);

export default callbackRouter;
