import { asyncHandler } from "../../utils/error handling/asyncHndler.js";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";
import Post from "../../DB/models/post.model.js";
import { nanoid } from "nanoid";
import { roles } from "../../DB/models/user.model.js";

// create post
export const createPost = asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  let images = [];
  let cloudFolder;
  if (req.files.length) {
    cloudFolder = nanoid();
    for (const file of req.files) {
      // upload cloudinary
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.CLOUD_FOLDER_NAME}/users/${req.user._id}/posts/${cloudFolder}`,
        },
      );
      images.push({
        secure_url,
        public_id,
        cloudFolder,
        user: req.user._id,
      });
    }
  }

  const post = await Post.create({ text, images });
  return res.json({ success: true, post: { post } });
});

// update post
export const updatePost = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.body;

  // post
  const post = await Post.findOne({ _id: id, user: req.user._id });
  if (!post) return next(new Error("Post not found!", { cause: 404 }));

  let images = [];
  if (req.files.length) {
    cloudFolder = nanoid();
    for (const file of req.files) {
      // upload cloudinary
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.CLOUD_FOLDER_NAME}/users/${req.user._id}/posts/${post.cloudFolder}`,
        },
      );
      images.push({
        secure_url,
        public_id,
        cloudFolder,
        user: req.user._id,
      });
    }
    if (post.images.length) {
      for (const image of images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
    post.images = images;
  }

  post.text = text ? text : post.text;
  await post.save();

  return res.json({ success: true, post: { post } });
});

// soft delete post (freeze)
export const freezePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return next(new Error("Post not founde!", { cause: 404 }));

  // check uesr ? admin || user
  if (
    post.user.toString() == req.user._id.toString()
    || req.user.role == roles.admin
  ) {
    post.isDeleted = true;
    post.deletedBy = req.user._id;
  }

  await post.save();
  return res.json({ success: true, post: { post } });
});

// unfreeze post (restore)
export const unfreezePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOneAndUpdate(
    {
      _id: id,
      isDeleted: true,
      deletedBy: req.user._id,
    },
    {
      isDeleted: false,
      $unset: { deletedBy: 0 },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!post) return next(new Error("Post not founde!", { cause: 404 }));

  return res.json({ success: true, post: { post } });
});

// get single post
export const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).populate([
    { path: "user", select: "userName profilePicture.secure_url" },
    {
      path: "comments",
      select: "text image createdAt",
      match: { parentComment: { $exists: false } },
      populate: [
        { path: "user", select: "userName profilePicture.secure_url" },
        { path: "replies" },
      ],
    },
  ]);

  if (!post) return next(new Error("Post not founde!", { cause: 404 }));
  return res.json({ success: true, results: { post } });
});

// get all active posts
export const getActivePosts = asyncHandler(async (req, res, next) => {
  // let posts;
  // if (req.user.role == roles.admin) {
  //   posts = await Post.find({ isDeleted: false }).populate({
  //     path: "user",
  //     select: "userName profilePicture.secure_url",
  //   });
  // } else if (req.user.role == roles.user) {
  //   posts = await Post.find({ isDeleted: false, user: req.user._id }).populate({
  //     path: "user",
  //     select: "userName profilePicture.secure_url",
  //   });
  // }

  let { page } = req.query;

  const results = await Post.find({ isDeleted: false })
    .populate({
      path: "user",
      select: "userName profilePicture.secure_url",
    })
    .paginate(page);

  return res.json({ success: true, results });
});

// get all freezed posts
export const getFreezedPosts = asyncHandler(async (req, res, next) => {
  let posts;
  if (req.user.role == roles.admin) {
    posts = await Post.find({ isDeleted: true }).populate({
      path: "user",
      select: "userName profilePicture.secure_url",
    });
  } else if (req.user.role == roles.user) {
    posts = await Post.find({ isDeleted: true, user: req.user._id }).populate({
      path: "user",
      select: "userName profilePicture.secure_url",
    });
  }

  return res.json({ success: true, results: { posts } });
});

// like & unlike post
export const likePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const post = await Post.findOne({ _id: id, isDeleted: false });

  if (!post) return next(new Error("Post not found!", { cause: 404 }));

  // check user in like
  const isUserExit = post.likes.find(
    (user) => user.toString() == userId.toString(),
  );

  if (!isUserExit) {
    post.likes.push(userId); // like
  } else {
    post.likes = post.likes.filter(
      // unlike
      (user) => user.toString() != userId.toString(),
    );
  }

  const populatedPost = await Post.findOne({
    _id: id,
    isDeleted: false,
  }).populate({
    path: "likes",
    select: "userName profilePicture.secure_url",
  });

  await post.save();
  return res.json({ success: true, results: { populatedPost } });
});
