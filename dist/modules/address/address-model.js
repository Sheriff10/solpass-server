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
const mongoose_1 = __importStar(require("mongoose"));
const quest_model_1 = __importDefault(require("../../model/quest-model"));
// Helper function to fetch valid quest names
const fetchQuestNames = () => __awaiter(void 0, void 0, void 0, function* () {
    const quests = yield quest_model_1.default.find().select("name -_id");
    return quests.map((quest) => quest.name);
});
// Define the schema for Address
const AddressSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    point: { type: Number, default: 0 },
    completed_quests: [
        {
            type: String,
            validate: {
                validator: function (value) {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Check if value is not undefined or empty
                        if (!value)
                            return false;
                        // Fetch valid quest names and ensure the quest name exists
                        const validQuestNames = yield fetchQuestNames();
                        return validQuestNames.includes(value);
                    });
                },
                message: (props) => `${props.value} is not a valid quest name.`,
            },
        },
    ],
    threshold: { type: Boolean, default: false },
});
// Create the Address model
const Address = mongoose_1.default.model("Address", AddressSchema);
exports.default = Address;
