"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_config_1 = __importDefault(require("../config/secret-config"));
const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = secret_config_1.default;
class JWTService {
    constructor() {
        // Method to create an access token
        this.createAccessToken = (payload) => {
            try {
                const token = jsonwebtoken_1.default.sign(payload, this.accessKey, {
                    expiresIn: "1h",
                });
                return token;
            }
            catch (error) {
                console.error("Error creating access token:", error);
                throw new Error("Failed to create access token");
            }
        };
        // Method to create a refresh token
        this.createRefreshToken = (payload) => {
            try {
                const token = jsonwebtoken_1.default.sign(payload, this.refreshKey, {
                    expiresIn: "7d",
                });
                return token;
            }
            catch (error) {
                console.error("Error creating refresh token:", error);
                throw new Error("Failed to create refresh token");
            }
        };
        // Method to verify an access token
        this.verifyAccessToken = (token) => {
            try {
                // Verifies the token using the accessKey
                const decoded = jsonwebtoken_1.default.verify(token, this.accessKey);
                if (typeof decoded === "string") {
                    return null;
                }
                return decoded;
            }
            catch (error) {
                console.error("Error verifying access token:", error);
                throw new Error("Invalid or expired access token");
            }
        };
        // Method to verify a refresh token
        this.verifyRefreshToken = (token) => {
            try {
                // Verifies the token using the refreshKey
                const decoded = jsonwebtoken_1.default.verify(token, this.refreshKey);
                if (typeof decoded === "string") {
                    return null;
                }
                return decoded;
            }
            catch (error) {
                console.error("Error verifying refresh token:", error);
                throw new Error("Invalid or expired refresh token");
            }
        };
        this.accessKey = JWT_ACCESS_KEY;
        this.refreshKey = JWT_REFRESH_KEY;
    }
}
exports.default = JWTService;
