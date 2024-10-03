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
const quest_model_1 = __importDefault(require("../../model/quest-model"));
const address_model_1 = __importDefault(require("./address-model"));
class AddressService {
    constructor() {
        this.createAddressProfile = (address) => __awaiter(this, void 0, void 0, function* () {
            const addressExists = yield address_model_1.default.findOne({ address });
            if (!addressExists) {
                const newAddressProfile = new address_model_1.default({ address });
                yield newAddressProfile.save();
                return newAddressProfile;
            }
            return true;
        });
        this.questUpgrade = (address, point, newQuestName) => __awaiter(this, void 0, void 0, function* () {
            const addressProfile = yield address_model_1.default.findOne({ address });
            if (!addressProfile)
                return;
            if (addressProfile.completed_quests.includes(newQuestName)) {
                console.log(`Quest "${newQuestName}" is already completed.`);
                return; // Exit the function if the quest is already completed
            }
            const currentPoint = addressProfile.point;
            yield address_model_1.default.findOneAndUpdate({ address }, {
                $set: { point: currentPoint + point },
                $push: { completed_quests: newQuestName },
            }, { new: true });
        });
        this.getQuestPoint = (id) => __awaiter(this, void 0, void 0, function* () {
            const quest = yield quest_model_1.default.findById(id);
            if (!quest)
                throw new Error("Quest Not Found");
            return quest.points;
        });
        this.getAddressInfo = (address) => __awaiter(this, void 0, void 0, function* () {
            const getAddress = address_model_1.default.findOne({ address });
            if (!getAddress)
                throw new Error("Address Not Found");
            return getAddress;
        });
        this.getQuests = () => __awaiter(this, void 0, void 0, function* () {
            const getQuests = quest_model_1.default.find({});
            return getQuests;
        });
    }
}
exports.default = AddressService;
