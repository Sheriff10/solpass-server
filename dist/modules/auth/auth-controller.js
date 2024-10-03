"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.loginDeveloper = exports.signupDeveloper = exports.refreshAccessToken = exports.loginAddress = void 0;
const address_validation_1 = require("../address/address-validation");
const jwt_service_1 = __importDefault(require("../../service/jwt-service"));
const response_util_1 = __importStar(require("../../utils/response-util"));
const address_service_1 = __importDefault(require("../address/address-service"));
const secret_config_1 = __importDefault(require("../../config/secret-config"));
const developer_model_1 = __importDefault(require("../developers/developer-model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { NODE_ENV } = secret_config_1.default;
/**
 * ##################################################################
 * LOGIN ADDRESS
 * GENERATE TOKENS FOR AUTHENTICATION AND AUTHORIZATION
 * ##################################################################
 */
const loginAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const { error } = address_validation_1.createAddressProfileValidation.validate(req.body);
    if (error)
        return (0, response_util_1.default)(res, 400, `Validation Error: ${error.message}`);
    const { address } = req.body;
    const addressService = new address_service_1.default();
    try {
        const validAddress = yield addressService.createAddressProfile(address);
        if (!validAddress)
            return (0, response_util_1.default)(res, 500, "Failed to create address profile");
        const jwt = new jwt_service_1.default();
        const accessToken = jwt.createAccessToken({ address });
        const refreshToken = jwt.createRefreshToken({ address });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return (0, response_util_1.default)(res, 200, { accessToken });
    }
    catch (err) {
        console.error("Error in loginAddress:", err);
        (0, response_util_1.errorResponse)(res);
    }
});
exports.loginAddress = loginAddress;
/**
 * ##################################################################
 * GENERATE ACCESS TOKEN FOR ADDRESS WITH REFRESH TOKEN
 * ##################################################################
 */
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return (0, response_util_1.default)(res, 401, "No refresh token provided");
        }
        const jwtService = new jwt_service_1.default();
        const { verifyRefreshToken, createAccessToken } = jwtService;
        // Verify the refresh token
        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            return (0, response_util_1.default)(res, 401, "Invalid or expired refresh token");
        }
        // Create a new access token
        const accessToken = createAccessToken({ address: payload.address });
        // Return the new access token
        (0, response_util_1.default)(res, 200, { accessToken });
    }
    catch (error) {
        console.error("Error refreshing access token:", error);
        (0, response_util_1.default)(res, 401, "Access Denied");
    }
});
exports.refreshAccessToken = refreshAccessToken;
/**
 * ##################################################################
 * SIGNUP DEVELOPER
 * ##################################################################
 */
const signupDeveloper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const existingDeveloper = yield developer_model_1.default.findOne({ email });
        if (existingDeveloper) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const newDeveloper = new developer_model_1.default({
            email,
            password,
            apikeys: [],
        });
        yield newDeveloper.save();
        return res.status(201).json({
            message: "Developer account created successfully",
            developer: {
                id: newDeveloper._id,
                email: newDeveloper.email,
            },
        });
    }
    catch (error) {
        console.error("Error in signing up developer:", error);
        return (0, response_util_1.errorResponse)(res);
    }
});
exports.signupDeveloper = signupDeveloper;
/**
 * ##################################################################
 * LOGIN DEVELOPER
 * ##################################################################
 */
const loginDeveloper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log({ email, password });
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const developer = yield developer_model_1.default.findOne({ email });
        if (!developer) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = yield bcrypt_1.default.compare(password, developer.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const jwt = new jwt_service_1.default();
        const accessToken = jwt.createAccessToken({ email });
        return (0, response_util_1.default)(res, 200, { accessToken });
    }
    catch (error) {
        console.error("Error in logging in developer:", error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.loginDeveloper = loginDeveloper;
