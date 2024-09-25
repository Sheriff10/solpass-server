import Joi from "joi";

export const callbackValidation = Joi.object({
  statusUrl: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required()
    .label("Status URL"),
});
