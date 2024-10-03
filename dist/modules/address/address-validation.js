"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddressProfileValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAddressProfileValidation = joi_1.default.object({
    address: joi_1.default.string().required().min(44).max(44), // solana address length
});
