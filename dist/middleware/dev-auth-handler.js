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
exports.devAuthHandler = exports.apikeyHandler = void 0;
const developer_model_1 = __importDefault(require("../modules/developers/developer-model"));
const jwt_service_1 = __importDefault(require("../service/jwt-service"));
const response_util_1 = __importDefault(require("../utils/response-util"));
const apikeyHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = req.header("solpass-api-key");
    if (!apiKey) {
        return res.status(401).json({ message: "API key is missing" });
    }
    const developer = yield developer_model_1.default.findOne({ "apikeys.key": apiKey });
    if (!developer)
        return res.status(401).json({
            message: "Unauthorized Access. Please Ensure your API key is valid",
        });
    next();
});
exports.apikeyHandler = apikeyHandler;
const devAuthHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["dev-authorization"];
        console.log(authHeader);
        if (!authHeader) {
            return res.status(401).json({ message: "Access token is missing" });
        }
        if (!authHeader.toString().startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization header must be in the format: Bearer <token>",
            });
        }
        const token = authHeader.toString().split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        // Verify the token
        const jwtService = new jwt_service_1.default();
        const { verifyAccessToken } = jwtService;
        const decode = verifyAccessToken(token);
        if (!decode)
            return (0, response_util_1.default)(res, 401, "Invalid access token or expired");
        console.log(decode);
        // Store the decoded JWT in req.user
        req.user = decode; // `req.user` should now be recognized by TypeScript
        next();
    }
    catch (error) {
        console.log("Invalide JWT token");
        return (0, response_util_1.default)(res, 401, "JWT token Invalid");
    }
});
exports.devAuthHandler = devAuthHandler;
