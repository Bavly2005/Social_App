// values(functions) of resolve keys ... business logic
import Post from "../../../../DB/models/post.model.js";

// all posts
export const allPosts = async (_, args, context) => {
  const posts = await Post.find({ isDeleted: false }).populate("user");
  return {
    success: true,
    statusCode: 200,
    results: posts,
  };
};

// one post
export const onePost = async (_, args, context) => {
  const { id } = args;
  const post = await Post.findOne({ isDeleted: false, _id: id });
  return {
    success: true,
    statusCode: 200,
    results: post,
  };
};
