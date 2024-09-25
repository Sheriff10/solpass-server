import { Request, Response } from "express";
import ReclaimCallback from "./callback-service";
import response, {
  badReqResponse,
  errorResponse,
} from "../../utils/response-util";
import { BadRequest } from "../../custom-errors";
import AddressService from "../address/address-service";
import { callbackValidation } from "./callback-validation";

/**
 * ##################################################################
 * HANDLE CALLBACK: CHECKS IF PROOF IS SUBMITTED, ADDS POINT TO THE
 * ADDRESS AND COMPLETE QUEST FOR AN ADDRESS
 * ##################################################################
 */
export const handleCallback = async (req: Request, res: Response) => {
  try {
    const { error } = callbackValidation.validate(req.body);
    if (error) return badReqResponse(res, error.message);

    const { statusUrl } = req.body;
    const reclaimCallback = new ReclaimCallback();
    // const sessionId = req.query.callbackId;

    console.log(req.body);
    const proof = await reclaimCallback.verifyProofSubmission(statusUrl);
    if (!proof) return badReqResponse(res, "Proof not submitted");

    let parsedContext: any;
    const context = await reclaimCallback.extractData(proof);
    if (typeof context === "string") {
      parsedContext = JSON.parse(context);
    }

    const address = parsedContext.contextAddress;
    const message = parsedContext.contextMessage;
    const { questName, questId } = message;

    // update address profile
    const addressService = new AddressService();
    const questPoint = await addressService.getQuestPoint(questId);
    await addressService.questUpgrade(address, questPoint, questName); // adds point and new completed quest for address

    response(res, 204);
  } catch (error) {
    console.log("Error in Reclaim Callback ", error);
    errorResponse(res);
  }
};
