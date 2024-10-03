import { Request, Response } from "express";
import Quest from "../../model/quest-model";
import Address from "./address-model";
import { createAddressProfileValidation } from "./address-validation";

export default class AddressService {
  createAddressProfile = async (address: string) => {
    const addressExists = await Address.findOne({ address });

    if (!addressExists) {
      const newAddressProfile = new Address({ address });
      await newAddressProfile.save();
      return newAddressProfile;
    }

    return true;
  };

  questUpgrade = async (
    address: string,
    point: number,
    newQuestName: string
  ) => {
    const addressProfile = await Address.findOne({ address });
    if (!addressProfile) return;

    if (addressProfile.completed_quests.includes(newQuestName)) {
      console.log(`Quest "${newQuestName}" is already completed.`);
      return; // Exit the function if the quest is already completed
    }

    const currentPoint = addressProfile.point;
    await Address.findOneAndUpdate(
      { address },
      {
        $set: { point: currentPoint + point },
        $push: { completed_quests: newQuestName },
      },
      { new: true }
    );
  };

  getQuestPoint = async (id: string) => {
    const quest = await Quest.findById(id);
    if (!quest) throw new Error("Quest Not Found");

    return quest.points;
  };

  getAddressInfo = async (address: string) => {
    const getAddress = Address.findOne({ address });
    if (!getAddress) throw new Error("Address Not Found");

    return getAddress;
  };

  getQuests = async (): Promise<any> => {
    const getQuests = Quest.find({});
    return getQuests;
  };
}
