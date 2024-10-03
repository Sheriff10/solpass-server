import { Router } from "express";
import {
  addressCompletedQuest,
  addressPoint,
  createApiKey,
  getApiKey,
  getCategories,
  getQuestsByCategory,
  getSingleCategory,
  questDetail,
} from "./developer-controller";
import {
  apikeyHandler,
  devAuthHandler,
} from "../../middleware/dev-auth-handler";

const devRoute = Router();

devRoute.post("/apikey/create", devAuthHandler, createApiKey);
devRoute.get("/apikey/get", devAuthHandler, getApiKey);

devRoute.use(apikeyHandler);
devRoute.get("/address/:address/points", addressPoint);
devRoute.get("/address/:address/quests", addressCompletedQuest);
devRoute.get("/single-quest", questDetail);
devRoute.get("/categories", getCategories);
devRoute.get("/single-category", getSingleCategory);
devRoute.get("/quests/category", getQuestsByCategory);

export default devRoute;
