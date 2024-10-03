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
exports.getQuestsByCategory = exports.getSingleCategory = exports.getCategories = exports.questDetail = exports.addressCompletedQuest = exports.addressPoint = exports.getApiKey = exports.createApiKey = void 0;
const response_util_1 = require("../../utils/response-util");
const address_validation_1 = require("../address/address-validation");
const address_service_1 = __importDefault(require("../address/address-service"));
const category_model_1 = __importDefault(require("../../model/category-model"));
const quest_model_1 = __importDefault(require("../../model/quest-model"));
const developer_model_1 = __importDefault(require("./developer-model"));
const generate_apikey_util_1 = __importDefault(require("../../utils/generate-apikey-util"));
/**
 * ##################################################################
 * GENERATE NEW API KEY
 * ##################################################################
 */
const createApiKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name } = req.body;
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!email || !name) {
            return res
                .status(400)
                .json({ message: "Email and API key name are required" });
        }
        const developer = yield developer_model_1.default.findOne({ email });
        if (!developer) {
            return res.status(404).json({ message: "Developer not found" });
        }
        const date = new Date();
        const newApiKey = {
            name,
            key: (0, generate_apikey_util_1.default)(),
            createTime: date,
        };
        developer.apikeys.push(newApiKey);
        yield developer.save();
        return (0, response_util_1.devResponse)(res, { message: "New api key created" });
    }
    catch (error) {
        console.error("Error creating API key:", error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.createApiKey = createApiKey;
const getApiKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const user = yield developer_model_1.default.findOne({ email });
        if (!user)
            return (0, response_util_1.notFoundResponse)(res, "User not found");
        const apiKeys = user.apikeys;
        return (0, response_util_1.devResponse)(res, { apiKeys });
    }
    catch (error) {
        console.error("Error creating API key:", error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getApiKey = getApiKey;
/**
 * ##################################################################
 * GET VERIFICATION SCORE FOR A SOLANA ADDRESS
 * ##################################################################
 */
const addressPoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address } = req.params;
        const { error } = address_validation_1.createAddressProfileValidation.validate({ address });
        if (error)
            return (0, response_util_1.badReqResponse)(res, "Invalid address");
        const addressService = new address_service_1.default();
        const addressInfo = yield addressService.getAddressInfo(address);
        if (!addressInfo) {
            return (0, response_util_1.notFoundResponse)(res, "Address not found");
        }
        return (0, response_util_1.devResponse)(res, {
            address,
            point: addressInfo.point,
            threshold: addressInfo.threshold,
        });
    }
    catch (error) {
        console.log("Error in getting Address:", error);
        return (0, response_util_1.errorResponse)(res, "Internal Server Error");
    }
});
exports.addressPoint = addressPoint;
/**
 * ##################################################################
 * GET COMPLETED QUEST FOR A SOLANA ADDRESS
 * ##################################################################
 */
const addressCompletedQuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address } = req.params;
        const { error } = address_validation_1.createAddressProfileValidation.validate({ address });
        if (error)
            return (0, response_util_1.badReqResponse)(res, "Invalid address");
        const addressService = new address_service_1.default();
        const addressInfo = yield addressService.getAddressInfo(address);
        if (!addressInfo) {
            return (0, response_util_1.notFoundResponse)(res, "Address not found");
        }
        return (0, response_util_1.devResponse)(res, {
            address,
            completed_quests: addressInfo.completed_quests,
        });
    }
    catch (error) {
        console.log("Error in getting Address Completed Quest:", error);
        return (0, response_util_1.errorResponse)(res, "Internal Server Error");
    }
});
exports.addressCompletedQuest = addressCompletedQuest;
/**
 * ##################################################################
 * GET INFORMATION ABOUT A SPECIFIC QUEST
 * ##################################################################
 */
const questDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questName } = req.query;
        if (!questName)
            return (0, response_util_1.badReqResponse)(res, "Quest Name Required");
        const addressService = new address_service_1.default();
        const quests = yield addressService.getQuests();
        const sanitizedQuestName = typeof questName === "string" ? questName.trim() : "";
        const oneQuest = quests === null || quests === void 0 ? void 0 : quests.find((i) => {
            return (i.name.toLowerCase() === sanitizedQuestName.toLowerCase());
        });
        if (!oneQuest)
            return (0, response_util_1.badReqResponse)(res, "Quest not found");
        return (0, response_util_1.devResponse)(res, {
            name: oneQuest.name,
            description: oneQuest.description,
            points: oneQuest.points,
        });
    }
    catch (error) {
        console.log("Error in getting Quest info:", error);
        return (0, response_util_1.errorResponse)(res, "Internal Server Error");
    }
});
exports.questDetail = questDetail;
/**
 * ##################################################################
 * GET ALL QUEST CATEGORIES INFORMATION
 * ##################################################################
 */
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const categories = yield category_model_1.default.find({})
            .select("name description -_id")
            .skip(Number(offset))
            .limit(Number(limit));
        return (0, response_util_1.devResponse)(res, { categories });
    }
    catch (error) {
        console.log("Error in getting categories:", error);
        return (0, response_util_1.errorResponse)(res, "Internal Server Error");
    }
});
exports.getCategories = getCategories;
/**
 * ##################################################################
 * GET A SINGLE CATEGORY INFORMATION
 * ##################################################################
 */
const getSingleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName } = req.query;
        if (!categoryName)
            return (0, response_util_1.badReqResponse)(res, "Category Name Required");
        const sanitizedcategoryName = typeof categoryName === "string" ? categoryName.trim() : "";
        const categories = yield category_model_1.default.find({});
        const oneCategory = categories === null || categories === void 0 ? void 0 : categories.find((i) => {
            return (i.name.toLowerCase() === sanitizedcategoryName.toLowerCase());
        });
        if (!oneCategory)
            return (0, response_util_1.badReqResponse)(res, "Quest not found");
        return (0, response_util_1.devResponse)(res, {
            name: oneCategory.name,
            description: oneCategory.description,
        });
    }
    catch (error) {
        console.log("Error in getting Quest info:", error);
        return (0, response_util_1.errorResponse)(res, "Internal Server Error");
    }
});
exports.getSingleCategory = getSingleCategory;
/**
 * ##################################################################
 * GET INFORMATION ABOUT  QUESTS IN A SPECIFIC CATEGORY
 * ##################################################################
 */
const getQuestsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName } = req.query;
        if (!categoryName)
            return (0, response_util_1.badReqResponse)(res, "Category Name Required");
        const sanitizedcategoryName = typeof categoryName === "string" ? categoryName.trim() : "";
        const category = yield category_model_1.default.findOne({
            name: { $regex: new RegExp(`^${sanitizedcategoryName}$`, "i") },
        });
        if (!category)
            return (0, response_util_1.notFoundResponse)(res, "Category not found.");
        const quests = yield quest_model_1.default.find({ category: category._id })
            .select("name description points -_id")
            .populate("category", "name -_id");
        if (quests.length === 0)
            return (0, response_util_1.notFoundResponse)(res, "No quests found in this category.");
        return (0, response_util_1.devResponse)(res, { quests });
    }
    catch (error) {
        console.log("Error in getting Quests by Category:", error);
        return (0, response_util_1.errorResponse)(res, "Internal Server Error");
    }
});
exports.getQuestsByCategory = getQuestsByCategory;
