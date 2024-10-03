import { Router } from "express";
import {
  getAddressStats,
  getCategoryStatsByUserAddress,
  getQuestsByCategory,
} from "./address-controller";
import authHandler from "../../middleware/auth-handler";

const addressRoute = Router();

addressRoute.use(authHandler);
addressRoute.get("/category-stats/", getCategoryStatsByUserAddress);
addressRoute.get("/stats/", getAddressStats);
addressRoute.get("/category/:categoryId", getQuestsByCategory);

export default addressRoute;
