import Joi from "joi";

export const createAddressProfileValidation = Joi.object({
  address: Joi.string().required().min(44).max(44), // solana address length
});
