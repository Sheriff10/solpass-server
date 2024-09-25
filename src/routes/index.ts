import { Router } from "express";
import verificationRouter from "../modules/verification/verification-route";
import callbackRouter from "../modules/callback/callback-route";
import authRoute from "../modules/auth/auth-route";
import routeNotFound from "../middleware/not-found";
import addressRoute from "../modules/address/address-route";

const router = Router();

router.use("/auth", authRoute);
router.use("/callback", callbackRouter);
router.use("/verification", verificationRouter);
router.use("/address", addressRoute);
router.use(routeNotFound);

export default router;
