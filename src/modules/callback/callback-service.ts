import { Proof, Reclaim } from "@reclaimprotocol/js-sdk";
import axios from "axios";

export default class ReclaimCallback {
  verifyProofSubmission = async (
    statusUrl: string
  ): Promise<Proof | undefined> => {
    try {
      const response = await axios.get(statusUrl);
      const statusData = response.data;
      const statusV2 = statusData?.session?.statusV2;

      if (statusV2 !== "PROOF_GENERATION_SUCCESS") {
        console.log("Proof not submitted yet."); // Optional: Logging for better visibility
        return undefined;
      }

      const proofs = statusData?.session?.proofs;
      if (!Array.isArray(proofs) || proofs.length === 0) {
        console.log("No proofs found.");
        return undefined;
      }

      // Return the first proof
      return proofs[0];
    } catch (error) {
      // Handle errors gracefully
      console.error("Error fetching proof submission status:", error);
      return undefined;
    }
  };

  extractData = async (proof: Proof) => {
    /** This method takes a callback data verifies if the data is valid or not
     *  And it returns the context if the proof is successfull
     */
    const isProofVerified = await Reclaim.verifySignedProof(proof);
    if (!isProofVerified) {
      return false;
    }
    const context = proof.claimData.context;
    // const extractedParameterValues = proof.extractedParameterValues;

    return context;
  };
}
