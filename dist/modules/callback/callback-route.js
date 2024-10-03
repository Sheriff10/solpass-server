"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const callback_controller_1 = require("./callback-controller");
const callbackRouter = (0, express_1.Router)();
callbackRouter.post("/", callback_controller_1.handleCallback);
exports.default = callbackRouter;
