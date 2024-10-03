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
const secret_config_1 = __importDefault(require("../../config/secret-config"));
const { RECLAIM_APP_ID, RECLAIM_APP_SECRET, CALLBACK_URL } = secret_config_1.default;
class Verification {
    constructor() {
        this.proofUrl = (proofRequest, context) => __awaiter(this, void 0, void 0, function* () {
            /**
             * Creates a verification request using the Reclaim client.
             *
             * This function configures the Reclaim client with context data, callback URL,
             * proof request settings, and generates a signature. It then creates a
             * verification request and returns the request URL and status URL.
             *
             * @param {ProofRequest} proofRequest - An object containing provider ID, redirect URL, and other proof request details.
             * @param {ContextMessage} [context] - Optional context data containing an address and message to include in the request.
             * @returns {Promise<{ requestUrl: string, statusUrl: string }>} - An object containing the request URL and status URL for the verification request.
             */
            const reclaimClient = new js_sdk_1.Reclaim.ProofRequest(RECLAIM_APP_ID);
            context && reclaimClient.addContext(context.address, context.message);
            // reclaimClient.setAppCallbackUrl(CALLBACK_URL);
            // console.log("see callbackurl to ", CALLBACK_URL);
            yield reclaimClient.buildProofRequest(proofRequest.providerId, proofRequest.redirect, "V2Linking");
            proofRequest.redirect &&
                proofRequest.url &&
                reclaimClient.setRedirectUrl(proofRequest.url);
            reclaimClient.setSignature(yield reclaimClient.generateSignature(RECLAIM_APP_SECRET));
            const { requestUrl, statusUrl } = yield reclaimClient.createVerificationRequest();
            return { requestUrl, statusUrl };
        });
    }
}
exports.default = Verification;
