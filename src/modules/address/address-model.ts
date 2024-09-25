import mongoose, { Document, Schema } from "mongoose";
import Quest from "../../model/quest-model";

// Define the interface for the document
export interface AddressDocument extends Document {
  address: string;
  point: number;
  completed_quests: string[];
  threshold: boolean;
}

// Helper function to fetch valid quest names
const fetchQuestNames = async (): Promise<string[]> => {
  const quests = await Quest.find().select("name -_id");
  return quests.map((quest) => quest.name);
};

// Define the schema for Address
const AddressSchema: Schema<AddressDocument> = new Schema({
  address: { type: String, required: true },
  point: { type: Number, default: 0 },
  completed_quests: [
    {
      type: String,
      validate: {
        validator: async function (value: string) {
          // Check if value is not undefined or empty
          if (!value) return false;

          // Fetch valid quest names and ensure the quest name exists
          const validQuestNames = await fetchQuestNames();
          return validQuestNames.includes(value);
        },
        message: (props) => `${props.value} is not a valid quest name.`,
      },
    },
  ],
  threshold: { type: Boolean, default: false },
});

// Create the Address model
const Address = mongoose.model<AddressDocument>("Address", AddressSchema);

export default Address;
