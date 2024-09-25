import mongoose, { Schema, Document, Types } from "mongoose";

// Mongoose document interface for Quest
interface IQuest extends Document {
  name: string;
  description: string;
  projectId: string;
  points: number;
  category: string; // Reference to Category
  message: string;
}

// Mongoose schema for Quest
const QuestSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  projectId: {
    type: String,
    default: "",
  },
  points: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    ref: "Category", // Reference to Category model
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
});

// Create and export the Quest model
const Quest = mongoose.model<IQuest>("Quest", QuestSchema);

export default Quest;
