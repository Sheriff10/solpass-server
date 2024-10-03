import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IApiKey {
  name: string;
  key: string;
  createTime: Date;
}

export interface IDeveloper extends Document {
  email: string;
  password: string;
  apikeys: IApiKey[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema definition for the Developer model
const DeveloperSchema = new Schema<IDeveloper>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    apikeys: [
      {
        name: {
          type: String,
          required: true,
        },
        key: {
          type: String,
          required: true,
        },
        createTime: {
          type: Date,
          default: Date.now, // Automatically set to current date
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Password hashing before saving the developer
DeveloperSchema.pre<IDeveloper>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
DeveloperSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const Developer = model<IDeveloper>("Developer", DeveloperSchema);

export default Developer;
