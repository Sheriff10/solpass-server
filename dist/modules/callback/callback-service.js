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
const js_sdk_1 = require("@reclaimprotocol/js-sdk");
const axios_1 = __importDefault(require("axios"));
class ReclaimCallback {
    constructor() {
        this.verifyProofSubmission = (statusUrl) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield axios_1.default.get(statusUrl);
                const statusData = response.data;
                const statusV2 = (_a = statusData === null || statusData === void 0 ? void 0 : statusData.session) === null || _a === void 0 ? void 0 : _a.statusV2;
                if (statusV2 !== "PROOF_GENERATION_SUCCESS") {
                    console.log("Proof not submitted yet."); // Optional: Logging for better visibility
                    return undefined;
                }
                const proofs = (_b = statusData === null || statusData === void 0 ? void 0 : statusData.session) === null || _b === void 0 ? void 0 : _b.proofs;
                if (!Array.isArray(proofs) || proofs.length === 0) {
                    console.log("No proofs found.");
                    return undefined;
                }
                // Return the first proof
                return proofs[0];
            }
            catch (error) {
                // Handle errors gracefully
                console.error("Error fetching proof submission status:", error);
                return undefined;
            }
        });
        this.extractData = (proof) => __awaiter(this, void 0, void 0, function* () {
            /** This method takes a callback data verifies if the data is valid or not
             *  And it returns the context if the proof is successfull
             */
            const isProofVerified = yield js_sdk_1.Reclaim.verifySignedProof(proof);
            if (!isProofVerified) {
                return false;
            }
            const context = proof.claimData.context;
            // const extractedParameterValues = proof.extractedParameterValues;
            return context;
        });
    }
}
exports.default = ReclaimCallback;
