import joi from "joi";
import { fileObj } from "../../middleware/validatiob.middleware.js";
import { isValidObjectId } from "mongoose";

// create post
export const createPost = joi
  .object({
    text: joi.string().min(2),
    file: joi.array().items(fileObj),
  })
  .or("text", "file");

// update post
export const updatePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    text: joi.string().min(2),
    file: joi.array().items(fileObj),
  })
  .or("text", "file");

// freeze post
export const freezePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

// unfreeze post
export const unfreezePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

// get single post
export const getPost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

// like & unlike post
export const likePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

export const getActivePosts = joi
  .object({
    page: joi.number().min(1),
  })
  .required();
