import joi from "joi";

export const OnePostSchema = joi.object({ id: joi.string().required() });
