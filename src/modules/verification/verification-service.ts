import { Reclaim } from "@reclaimprotocol/js-sdk";
import secret from "../../config/secret-config";

interface ContextMessage {
  address: string;
  message: any;
}

interface ProofRequest {
  providerId: string;
  redirect?: boolean;
  url?: string;
}
const { RECLAIM_APP_ID, RECLAIM_APP_SECRET, CALLBACK_URL } = secret;

export default class Verification {
  proofUrl = async (proofRequest: ProofRequest, context?: ContextMessage) => {
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
    const reclaimClient = new Reclaim.ProofRequest(RECLAIM_APP_ID);
    context && reclaimClient.addContext(context.address, context.message);

    // reclaimClient.setAppCallbackUrl(CALLBACK_URL);
    // console.log("see callbackurl to ", CALLBACK_URL);

    await reclaimClient.buildProofRequest(
      proofRequest.providerId,
      proofRequest.redirect,
      "V2Linking"
    );

    proofRequest.redirect &&
      proofRequest.url &&
      reclaimClient.setRedirectUrl(proofRequest.url);

    reclaimClient.setSignature(
      await reclaimClient.generateSignature(RECLAIM_APP_SECRET)
    );

    const { requestUrl, statusUrl } =
      await reclaimClient.createVerificationRequest();

    return { requestUrl, statusUrl };
  };
}
