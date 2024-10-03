"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.callbackValidation = joi_1.default.object({
    statusUrl: joi_1.default.string()
        .uri({ scheme: ["http", "https"] })
        .required()
        .label("Status URL"),
});
