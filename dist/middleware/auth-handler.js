"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = __importDefault(require("../service/jwt-service"));
const response_util_1 = __importDefault(require("../utils/response-util"));
const authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Access token is missing" });
        }
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization header must be in the format: Bearer <token>",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        // Verify the token
        const jwtService = new jwt_service_1.default();
        const { verifyAccessToken } = jwtService;
        const decode = verifyAccessToken(token);
        if (!decode)
            return (0, response_util_1.default)(res, 401, "Invalid access token or expired");
        // Store the decoded JWT in req.user
        console.log(decode);
        req.user = decode; // `req.user` should now be recognized by TypeScript
        next();
    }
    catch (error) {
        console.log(error);
        return (0, response_util_1.default)(res, 401, "JWT token Invalid");
    }
});
exports.default = authHandler;
