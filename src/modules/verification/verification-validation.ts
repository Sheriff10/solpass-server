import Joi from "joi";
import Quest from "../../model/quest-model";

export enum QuestType {
  GITHUB = "GITHUB",
  GOOGLE = "GOOGLE",
  UBER = "UBER",
  FACEBOOK = "FACEBOOK",
}

// export const postRequestSchema = Joi.object({
//   address: Joi.string().required().min(44).max(44), // solana address length
//   questType: Joi.string()
//     .valid(...Object.values(QuestType))
//     .required(),
// });

// Function to create the Joi schema dynamically based on categories in the database
export const getPostRequestSchema = async () => {
  // Fetch the categories from the database
  const categories = await Quest.find().select("name -_id");
  const categoryNames = categories.map((category) => category.name);

  return Joi.object({
    address: Joi.string().required().min(44).max(44), // Solana address length validation
    questType: Joi.string()
      .valid(...categoryNames) // Use dynamic category names
      .required(),
  });
};

export const mongooseIdValidation = Joi.object({
  id: Joi.string().length(24).hex().required().label("MongoDB ObjectId"),
});
