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
exports.getQuestsByCategory = exports.getAddressStats = exports.getCategoryStatsByUserAddress = void 0;
const category_model_1 = __importDefault(require("../../model/category-model"));
const quest_model_1 = __importDefault(require("../../model/quest-model"));
const response_util_1 = __importStar(require("../../utils/response-util"));
const address_validation_1 = require("./address-validation");
const address_service_1 = __importDefault(require("./address-service"));
const verification_validation_1 = require("../verification/verification-validation");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * ##################################################################
 * GET ALL CATEGORIES WITH TOTAL QUEST AND COMPLETED TASK BY USER
 * ADDRESS
 * ##################################################################
 */
const getCategoryStatsByUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const { address: userAddress } = req.params;
    const userAddress = (_a = req.user) === null || _a === void 0 ? void 0 : _a.address;
    const { error } = address_validation_1.createAddressProfileValidation.validate({
        address: userAddress,
    });
    if (error)
        return (0, response_util_1.badReqResponse)(res, error.message);
    try {
        // Step 1: Fetch categories along with descriptions
        const categories = yield category_model_1.default.find().select("name description _id");
        // Step 2: Fetch quest stats for the given user address
        const result = yield quest_model_1.default.aggregate([
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
            const stats = result.find((r) => r.categoryId.toString() === category._id.toString()) || {
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
        return (0, response_util_1.default)(res, 200, finalResult, `${userAddress} categories stats`);
    }
    catch (error) {
        console.error("Error fetching category stats:", error);
        return (0, response_util_1.errorResponse)(res, "Error Getting user category stats");
    }
});
exports.getCategoryStatsByUserAddress = getCategoryStatsByUserAddress;
/**
 * ##################################################################
 * GET USER STATS: POINTS, COMPLETED QUEST, ETC
 * ##################################################################
 */
const getAddressStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // const { address } = req.params;
        const address = (_a = req.user) === null || _a === void 0 ? void 0 : _a.address;
        const { error } = address_validation_1.createAddressProfileValidation.validate({
            address,
        });
        if (error)
            return (0, response_util_1.badReqResponse)(res, error.message);
        const addressService = new address_service_1.default();
        const addressData = yield addressService.getAddressInfo(address);
        const totalQuest = yield quest_model_1.default.countDocuments();
        const point = addressData === null || addressData === void 0 ? void 0 : addressData.point;
        const totalCompletedQuest = addressData === null || addressData === void 0 ? void 0 : addressData.completed_quests.length;
        const completed_quests = addressData === null || addressData === void 0 ? void 0 : addressData.completed_quests;
        const stats = { point, totalCompletedQuest, completed_quests, totalQuest };
        (0, response_util_1.default)(res, 200, stats, "User stats");
    }
    catch (error) {
        console.error("Error fetching category stats:", error);
        return (0, response_util_1.errorResponse)(res, "Error Getting user category stats");
    }
});
exports.getAddressStats = getAddressStats;
/**
 * ##################################################################
 * GET QUEST BY CATEGORIES ID
 * ##################################################################
 */
const getQuestsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    // Validate that categoryId is a valid MongoDB ObjectId
    const { error } = verification_validation_1.mongooseIdValidation.validate({ id: categoryId });
    if (error)
        return (0, response_util_1.badReqResponse)(res, error.message);
    // Convert categoryId string to ObjectId
    const id = new mongoose_1.default.Types.ObjectId(categoryId);
    // Find the category by its ObjectId
    const category = yield category_model_1.default.findById(id);
    if (!category)
        return (0, response_util_1.notFoundResponse)(res, "Category not found.");
    // Find quests associated with this category
    const quests = yield quest_model_1.default.find({ category: id });
    if (quests.length === 0)
        return (0, response_util_1.notFoundResponse)(res, "No quests found in this category.");
    // Return the found quests
    return (0, response_util_1.default)(res, 200, quests, `Quests found in category: ${category.name}`);
});
exports.getQuestsByCategory = getQuestsByCategory;
