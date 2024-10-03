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
exports.handleCallback = void 0;
const callback_service_1 = __importDefault(require("./callback-service"));
const response_util_1 = __importStar(require("../../utils/response-util"));
const address_service_1 = __importDefault(require("../address/address-service"));
const callback_validation_1 = require("./callback-validation");
/**
 * ##################################################################
 * HANDLE CALLBACK: CHECKS IF PROOF IS SUBMITTED, ADDS POINT TO THE
 * ADDRESS AND COMPLETE QUEST FOR AN ADDRESS
 * ##################################################################
 */
const handleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = callback_validation_1.callbackValidation.validate(req.body);
        if (error)
            return (0, response_util_1.badReqResponse)(res, error.message);
        const { statusUrl } = req.body;
        const reclaimCallback = new callback_service_1.default();
        // const sessionId = req.query.callbackId;
        console.log(req.body);
        const proof = yield reclaimCallback.verifyProofSubmission(statusUrl);
        if (!proof)
            return (0, response_util_1.badReqResponse)(res, "Proof not submitted");
        let parsedContext;
        const context = yield reclaimCallback.extractData(proof);
        if (typeof context === "string") {
            parsedContext = JSON.parse(context);
        }
        const address = parsedContext.contextAddress;
        const message = parsedContext.contextMessage;
        const { questName, questId } = message;
        // update address profile
        const addressService = new address_service_1.default();
        const questPoint = yield addressService.getQuestPoint(questId);
        yield addressService.questUpgrade(address, questPoint, questName); // adds point and new completed quest for address
        (0, response_util_1.default)(res, 204);
    }
    catch (error) {
        console.log("Error in Reclaim Callback ", error);
        (0, response_util_1.errorResponse)(res);
    }
});
exports.handleCallback = handleCallback;
