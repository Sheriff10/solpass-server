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
exports.mongooseIdValidation = exports.getPostRequestSchema = exports.QuestType = void 0;
const joi_1 = __importDefault(require("joi"));
const quest_model_1 = __importDefault(require("../../model/quest-model"));
var QuestType;
(function (QuestType) {
    QuestType["GITHUB"] = "GITHUB";
    QuestType["GOOGLE"] = "GOOGLE";
    QuestType["UBER"] = "UBER";
    QuestType["FACEBOOK"] = "FACEBOOK";
})(QuestType || (exports.QuestType = QuestType = {}));
// export const postRequestSchema = Joi.object({
//   address: Joi.string().required().min(44).max(44), // solana address length
//   questType: Joi.string()
//     .valid(...Object.values(QuestType))
//     .required(),
// });
// Function to create the Joi schema dynamically based on categories in the database
const getPostRequestSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the categories from the database
    const categories = yield quest_model_1.default.find().select("name -_id");
    const categoryNames = categories.map((category) => category.name);
    return joi_1.default.object({
        // address: Joi.string().required().min(44).max(44), // Solana address length validation
        questType: joi_1.default.string()
            .valid(...categoryNames) // Use dynamic category names
            .required(),
    });
});
exports.getPostRequestSchema = getPostRequestSchema;
exports.mongooseIdValidation = joi_1.default.object({
    id: joi_1.default.string().length(24).hex().required().label("MongoDB ObjectId"),
});
