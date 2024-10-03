"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verification_controller_1 = require("./verification-controller");
const auth_handler_1 = __importDefault(require("../../middleware/auth-handler"));
const verificationRouter = (0, express_1.Router)();
verificationRouter.use(auth_handler_1.default);
verificationRouter.post("/", verification_controller_1.createVerification);
exports.default = verificationRouter;
