import joi from "joi";
import { isValidObjectId } from "../../middleware/validatiob.middleware";

export const getChat = joi
  .object({
    friendId: joi.custom(isValidObjectId).required(),
  })
  .required();

export const sendMessage = joi
  .object({
    friendId: joi.custom(isValidObjectId).required(),
    content: joi.string().required(),
  })
  .required();
