import Comment from "../../DB/models/comment.model.js";
import Post from "../../DB/models/post.model.js";
import { roles } from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/error handling/asyncHndler.js";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";

// create
export const createComment = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;

  const post = await Post.find({ _id: postId, isDeleted: false });
  if (!post) return next(new Error("Post not found!", { cause: 404 }));

  let image;
  if (req.file) {
    // upload cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/users/${post.user}/posts/${postId.cloudFolder}/comments`,
      },
    );
    // save image
    image = { secure_url, public_id };
  }

  // create comment
  const comment = await Comment.create({
    text,
    image,
    user: req.user._id,
    post: postId,
  });

  return res.json({ success: true, results: { comment } });
});

// update
export const updateComment = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params; // comment

  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("Comment not found!", { cause: 404 }));

  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post) return next(new Error("Post not found!", { cause: 404 }));

  if (comment.user.toString() != req.user._id.toString())
    return next(new Error("Not authorized to update!", { cause: 403 }));

  let image;
  if (req.file) {
    // upload cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/users/${post.user}/posts/${postId.cloudFolder}/comments`,
      },
    );
    // save image
    image = { secure_url, public_id };

    // delete previous image
    if (comment.image) {
      await cloudinary.uploader.destroy(comment.image.public_id);
    }
    comment.image = image;
  }

  comment.text = text ? text : comment.text;
  await comment.save();

  return res.json({ success: true, results: { comment } });
});

// soft delete
export const deleteComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("Comment not found!", { cause: 404 }));

  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post) return next(new Error("Post not found!", { cause: 404 }));

  const commentWriter = req.user._id.toString() == comment.user.toString();

  const postOwner = req.user._id.toString() == post.user.toString();

  const admin = req.user.role == roles.admin;

  if (!commentWriter && !postOwner && !admin)
    return next(new Error("Not allowed to delete!", { cause: 403 }));

  comment.isDeleted = true;
  comment.deletedBy = req.user._id;

  await comment.save();
  return res.json({ success: true, results: { comment } });
});

// get all comments
export const getAllComments = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post) return next(new Error("Post not found!", { cause: 404 }));

  const comments = Comment.find({
    post: postId,
    isDeleted: false,
    parentComment: { $exists: false },
  }).populate("replies");

  return res.json({ success: true, results: { comments } });
});

// like & unlike
export const likeComments = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("Comment not found!", { cause: 404 }));

  // check user in like
  const isUserExit = comment.likes.find(
    (user) => user.toString() == userId.toString(),
  );

  if (!isUserExit) {
    comment.likes.push(userId); // like
  } else {
    comment.likes = comment.likes.filter(
      // unlike
      (user) => user.toString() != userId.toString(),
    );
  }

  // const populatedPost = await Post.findOne({ _id: id, isDeleted: false })
  // .populate({
  //     path: "likes",
  //     select: "userName profilePicture.secure_url"
  // })

  await comment.save();
  return res.json({ success: true, results: { comment } });
});

// add reply
export const addReply = asyncHandler(async (req, res, next) => {
  const { postId, id } = req.params;

  const comment = await Comment.findOne({
    _id: id,
    post: postId,
    isDeleted: false,
  });
  if (!comment) return next(new Error("Comment not found!", { cause: 404 }));

  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post) return next(new Error("Post not found!", { cause: 404 }));

  let image;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/users/${post.user}/posts/${postId.cloudFolder}/comments/${comment._id}`,
      },
    );

    image = { secure_url, public_id };
  }

  const reply = await Comment.create({
    ...req.body,
    image,
    user: req.user._id,
    post: postId,
    parentComment: comment._id,
  });

  return res.json({ success: true, results: { reply } });
});

// hard delete
export const hardDelete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) return next(new Error("Comment not found!", { cause: 404 }));

  const post = await Post.findOne({ _id: comment.post, isDeleted: false });
  if (!post) return next(new Error("Post not found!", { cause: 404 }));

  const commentWriter = req.user._id.toString() == comment.user.toString();

  const postOwner = req.user._id.toString() == post.user.toString();

  const admin = req.user.role == roles.admin;

  if (!commentWriter && !postOwner && !admin)
    return next(new Error("Not allowed to delete!", { cause: 403 }));

  await comment.deleteOne();
  return res.json({ success: true, message: "Comment deleted successfully!" });
});
