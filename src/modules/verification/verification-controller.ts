import { Request, Response } from "express";
import Verification from "./verification-service";
import quests from "../../constants/quest-const";
import response, {
  badReqResponse,
  errorResponse,
} from "../../utils/response-util";
import { getPostRequestSchema } from "./verification-validation";
import Quest from "../../model/quest-model";

export const createVerification = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const postRequestSchema = await getPostRequestSchema();
    const address = req.user?.address;
    const { error } = postRequestSchema.validate(req.body);
    console.log(error?.message);
    if (error) return badReqResponse(res, error.message);

    const { questType } = req.body;

    // const quest = quests.find((quest) => quest.name === questType);
    const quest = await Quest.findOne({ name: questType });
    if (!quest) return badReqResponse(res, "Invalid quest type");

    const context = {
      address,
      message: { questId: quest._id, questName: quest.name },
    };

    const verification = new Verification();
    const proofRequest = {
      providerId: quest.projectId || "",
    };

    const { requestUrl, statusUrl } = await verification.proofUrl(
      proofRequest,
      context
    );

    response(res, 200, { requestUrl, statusUrl }, "Verification URL generated");
  } catch (error) {
    console.error("Error in Verification", error);
    errorResponse(res);
  }
};
