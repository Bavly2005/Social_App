import joi from "joi";
import {
  fileObj,
  isValidObjectId,
} from "../../middleware/validatiob.middleware.js";

// create
export const createComment = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: fileObj,
  })
  .or("text", "file");
// update
export const updateComment = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: fileObj,
  })
  .or("text", "file");

// delete
export const deleteComment = joi.object({
  id: joi.custom(isValidObjectId).required(),
});

// get all
export const getAllComments = joi.object({
  postId: joi.custom(isValidObjectId).required(),
});

// like & unlike
export const likeComments = joi.object({
  id: joi.custom(isValidObjectId).required(),
});

// add reply
export const addReply = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    postId: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: fileObj,
  })
  .or("text", "file");

// hard delete
export const hardDelete = joi.object({
  id: joi.custom(isValidObjectId).required(),
});
