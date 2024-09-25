import { Router } from "express";
import {
  getAddressStats,
  getCategoryStatsByUserAddress,
  getQuestsByCategory,
} from "./address-controller";

const addressRoute = Router();

addressRoute.get("/category-stats/:address", getCategoryStatsByUserAddress);
addressRoute.get("/stats/:address", getAddressStats);
addressRoute.get("/category/:categoryId", getQuestsByCategory);

export default addressRoute;
