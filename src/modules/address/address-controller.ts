import { Request, Response } from "express";
import Category from "../../model/category-model";
import Quest from "../../model/quest-model";
import Address from "./address-model"; // Your Address model
import response, {
  badReqResponse,
  errorResponse,
  notFoundResponse,
} from "../../utils/response-util";
import { createAddressProfileValidation } from "./address-validation";
import AddressService from "./address-service";
import { mongooseIdValidation } from "../verification/verification-validation";
import mongoose, { ObjectId } from "mongoose";

/**
 * ##################################################################
 * GET ALL CATEGORIES WITH TOTAL QUEST AND COMPLETED TASK BY USER
 * ADDRESS
 * ##################################################################
 */
export const getCategoryStatsByUserAddress = async (
  req: Request,
  res: Response
) => {
  const { address: userAddress } = req.params;
  const { error } = createAddressProfileValidation.validate({
    address: userAddress,
  });
  if (error) return badReqResponse(res, error.message);

  try {
    // Step 1: Fetch categories along with descriptions
    const categories = await Category.find().select("name description _id");

    // Step 2: Fetch quest stats for the given user address
    const result = await Quest.aggregate([
      {
        $group: {
          _id: "$category",
          totalQuest: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "addresses",
          let: { categoryId: "$_id" },
          pipeline: [
            { $match: { address: userAddress } },
            { $unwind: "$completed_quests" },
            {
              $lookup: {
                from: "quests",
                localField: "completed_quests",
                foreignField: "name",
                as: "questDetails",
              },
            },
            { $unwind: "$questDetails" },
            {
              $match: {
                $expr: { $eq: ["$questDetails.category", "$$categoryId"] },
              },
            },
          ],
          as: "completedQuests",
        },
      },
      {
        $project: {
          categoryId: "$_id", // Project the categoryId
          totalQuest: 1,
          completed: { $size: "$completedQuests" }, // Count completed quests
        },
      },
    ]);

    // Step 3: Combine categories with result and return with description
    const finalResult = categories.map((category) => {
      const stats = result.find(
        (r) => r.categoryId.toString() === category._id.toString()
      ) || {
        totalQuest: 0,
        completed: 0,
      };
      return {
        _id: category._id,
        name: category.name,
        description: category.description, // Include the description here
        totalQuest: stats.totalQuest,
        completed: stats.completed,
      };
    });

    // Return the result
    return response(res, 200, finalResult, `${userAddress} categories stats`);
  } catch (error) {
    console.error("Error fetching category stats:", error);
    return errorResponse(res, "Error Getting user category stats");
  }
};

/**
 * ##################################################################
 * GET USER STATS: POINTS, COMPLETED QUEST, ETC
 * ##################################################################
 */

export const getAddressStats = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { error } = createAddressProfileValidation.validate({
      address,
    });
    if (error) return badReqResponse(res, error.message);

    const addressService = new AddressService();
    const addressData = await addressService.getAddressInfo(address);

    const totalQuest = await Quest.countDocuments();
    const point = addressData?.point;
    const totalCompletedQuest = addressData?.completed_quests.length;
    const completed_quests = addressData?.completed_quests;
    const stats = { point, totalCompletedQuest, completed_quests, totalQuest };

    response(res, 200, stats, "User stats");
  } catch (error) {
    console.error("Error fetching category stats:", error);
    return errorResponse(res, "Error Getting user category stats");
  }
};

/**
 * ##################################################################
 * GET QUEST BY CATEGORIES ID
 * ##################################################################
 */

export const getQuestsByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  // Validate that categoryId is a valid MongoDB ObjectId
  const { error } = mongooseIdValidation.validate({ id: categoryId });
  if (error) return badReqResponse(res, error.message);

  // Convert categoryId string to ObjectId
  const id = new mongoose.Types.ObjectId(categoryId);

  // Find the category by its ObjectId
  const category = await Category.findById(id);
  if (!category) return notFoundResponse(res, "Category not found.");

  // Find quests associated with this category
  const quests = await Quest.find({ category: id });
  if (quests.length === 0)
    return notFoundResponse(res, "No quests found in this category.");

  // Return the found quests
  return response(
    res,
    200,
    quests,
    `Quests found in category: ${category.name}`
  );
};
