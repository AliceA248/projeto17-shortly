import joi from "joi";

const urlSchema = joi.object({
  url: joi
    .string()
    .uri({ scheme: ["http", "https"] })
    .required(),
});
export default urlSchema;