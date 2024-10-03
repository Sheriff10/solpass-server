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
exports.createVerification = void 0;
const verification_service_1 = __importDefault(require("./verification-service"));
const response_util_1 = __importStar(require("../../utils/response-util"));
const verification_validation_1 = require("./verification-validation");
const quest_model_1 = __importDefault(require("../../model/quest-model"));
const createVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Validate request body
        const postRequestSchema = yield (0, verification_validation_1.getPostRequestSchema)();
        const address = (_a = req.user) === null || _a === void 0 ? void 0 : _a.address;
        const { error } = postRequestSchema.validate(req.body);
        console.log(error === null || error === void 0 ? void 0 : error.message);
        if (error)
            return (0, response_util_1.badReqResponse)(res, error.message);
        const { questType } = req.body;
        // const quest = quests.find((quest) => quest.name === questType);
        const quest = yield quest_model_1.default.findOne({ name: questType });
        if (!quest)
            return (0, response_util_1.badReqResponse)(res, "Invalid quest type");
        const context = {
            address,
            message: { questId: quest._id, questName: quest.name },
        };
        const verification = new verification_service_1.default();
        const proofRequest = {
            providerId: quest.projectId || "",
        };
        const { requestUrl, statusUrl } = yield verification.proofUrl(proofRequest, context);
        (0, response_util_1.default)(res, 200, { requestUrl, statusUrl }, "Verification URL generated");
    }
    catch (error) {
        console.error("Error in Verification", error);
        (0, response_util_1.errorResponse)(res);
    }
});
exports.createVerification = createVerification;
