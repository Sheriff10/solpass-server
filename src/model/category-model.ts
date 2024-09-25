import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  name: string;
  description: string; // New description field
  _id: mongoose.Types.ObjectId;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false, // Set to `false` if it's optional
  },
});

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
