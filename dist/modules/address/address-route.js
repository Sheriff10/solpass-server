"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("./address-controller");
const auth_handler_1 = __importDefault(require("../../middleware/auth-handler"));
const addressRoute = (0, express_1.Router)();
addressRoute.use(auth_handler_1.default);
addressRoute.get("/category-stats/", address_controller_1.getCategoryStatsByUserAddress);
addressRoute.get("/stats/", address_controller_1.getAddressStats);
addressRoute.get("/category/:categoryId", address_controller_1.getQuestsByCategory);
exports.default = addressRoute;
