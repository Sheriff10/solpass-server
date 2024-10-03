import { Request, Response } from "express";
import {
  badReqResponse,
  devResponse,
  errorResponse,
  notFoundResponse,
} from "../../utils/response-util";
import { createAddressProfileValidation } from "../address/address-validation";
import AddressService from "../address/address-service";
import Category from "../../model/category-model";
import Quest from "../../model/quest-model";
import Developer from "./developer-model";
import generateKey from "../../utils/generate-apikey-util";

/**
 * ##################################################################
 * GENERATE NEW API KEY
 * ##################################################################
 */

export const createApiKey = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const email = req.user?.email;

    if (!email || !name) {
      return res
        .status(400)
        .json({ message: "Email and API key name are required" });
    }

    const developer = await Developer.findOne({ email });
    if (!developer) {
      return res.status(404).json({ message: "Developer not found" });
    }

    const date = new Date();
    const newApiKey = {
      name,
      key: generateKey(),
      createTime: date,
    };

    developer.apikeys.push(newApiKey);
    await developer.save();

    return devResponse(res, { message: "New api key created" });
  } catch (error) {
    console.error("Error creating API key:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getApiKey = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email;
    const user = await Developer.findOne({ email });

    if (!user) return notFoundResponse(res, "User not found");
    const apiKeys = user.apikeys;

    return devResponse(res, { apiKeys });
  } catch (error) {
    console.error("Error creating API key:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ##################################################################
 * GET VERIFICATION SCORE FOR A SOLANA ADDRESS
 * ##################################################################
 */

export const addressPoint = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { error } = createAddressProfileValidation.validate({ address });
    if (error) return badReqResponse(res, "Invalid address");

    const addressService = new AddressService();
    const addressInfo = await addressService.getAddressInfo(address);

    if (!addressInfo) {
      return notFoundResponse(res, "Address not found");
    }

    return devResponse(res, {
      address,
      point: addressInfo.point,
      threshold: addressInfo.threshold,
    });
  } catch (error) {
    console.log("Error in getting Address:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * ##################################################################
 * GET COMPLETED QUEST FOR A SOLANA ADDRESS
 * ##################################################################
 */

export const addressCompletedQuest = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { error } = createAddressProfileValidation.validate({ address });
    if (error) return badReqResponse(res, "Invalid address");

    const addressService = new AddressService();
    const addressInfo = await addressService.getAddressInfo(address);

    if (!addressInfo) {
      return notFoundResponse(res, "Address not found");
    }

    return devResponse(res, {
      address,
      completed_quests: addressInfo.completed_quests,
    });
  } catch (error) {
    console.log("Error in getting Address Completed Quest:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * ##################################################################
 * GET INFORMATION ABOUT A SPECIFIC QUEST
 * ##################################################################
 */

export const questDetail = async (req: Request, res: Response) => {
  try {
    const { questName } = req.query;
    if (!questName) return badReqResponse(res, "Quest Name Required");

    const addressService = new AddressService();
    const quests = await addressService.getQuests();

    const sanitizedQuestName =
      typeof questName === "string" ? questName.trim() : "";

    const oneQuest = quests?.find((i: any) => {
      return (
        i.name.toLowerCase() === (sanitizedQuestName as string).toLowerCase()
      );
    });

    if (!oneQuest) return badReqResponse(res, "Quest not found");

    return devResponse(res, {
      name: oneQuest.name,
      description: oneQuest.description,
      points: oneQuest.points,
    });
  } catch (error) {
    console.log("Error in getting Quest info:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * ##################################################################
 * GET ALL QUEST CATEGORIES INFORMATION
 * ##################################################################
 */

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const categories = await Category.find({})
      .select("name description -_id")
      .skip(Number(offset))
      .limit(Number(limit));

    return devResponse(res, { categories });
  } catch (error) {
    console.log("Error in getting categories:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * ##################################################################
 * GET A SINGLE CATEGORY INFORMATION
 * ##################################################################
 */

export const getSingleCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.query;
    if (!categoryName) return badReqResponse(res, "Category Name Required");

    const sanitizedcategoryName =
      typeof categoryName === "string" ? categoryName.trim() : "";

    const categories = await Category.find({});

    const oneCategory = categories?.find((i: any) => {
      return (
        i.name.toLowerCase() === (sanitizedcategoryName as string).toLowerCase()
      );
    });

    if (!oneCategory) return badReqResponse(res, "Quest not found");

    return devResponse(res, {
      name: oneCategory.name,
      description: oneCategory.description,
    });
  } catch (error) {
    console.log("Error in getting Quest info:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * ##################################################################
 * GET INFORMATION ABOUT  QUESTS IN A SPECIFIC CATEGORY
 * ##################################################################
 */

export const getQuestsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.query;
    if (!categoryName) return badReqResponse(res, "Category Name Required");
    const sanitizedcategoryName =
      typeof categoryName === "string" ? categoryName.trim() : "";

    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${sanitizedcategoryName}$`, "i") },
    });

    if (!category) return notFoundResponse(res, "Category not found.");

    const quests = await Quest.find({ category: category._id })
      .select("name description points -_id")
      .populate("category", "name -_id");

    if (quests.length === 0)
      return notFoundResponse(res, "No quests found in this category.");

    return devResponse(res, { quests });
  } catch (error) {
    console.log("Error in getting Quests by Category:", error);
    return errorResponse(res, "Internal Server Error");
  }
};
