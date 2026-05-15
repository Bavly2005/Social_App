import joi from "joi";
import { isValidObjectId } from "../../middleware/validatiob.middleware.js";

// update profile
export const updateProfile = joi
  .object({
    userName: joi.string().min(5).max(15),
    email: joi.string().email(),
  })
  .required();

// update password
export const updatePassword = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().not(joi.ref("oldPassword")).required(),
  })
  .required();

// update email
export const updateEmail = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

// send friend request
export const sendFriendRequest = joi
  .object({ friendId: joi.custom(isValidObjectId) })
  .required();

// accept friend request
export const acceptFriendRequest = joi
  .object({ friendId: joi.custom(isValidObjectId) })
  .required();
