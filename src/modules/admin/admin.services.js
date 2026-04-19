import User from "../../DB/models/user.model.js";
import Post from "../../DB/models/post.model.js";
import { asyncHandler } from "../../utils/error handling/asyncHndler.js";

// get all users and posts
export const getAll = asyncHandler(async (req, res, next) => {
  const results = await Promise.all([User.find(), Post.find()]);
  return res.json({ success: true, results });
});

// changeRole
export const changeRole = asyncHandler(async (req, res, next) => {
  const { userId, roles } = req.body;

  const user = await User.findOneAndUpdate({ _id: userId }, { roles });

  return res.json({ success: true });
});
