import { Router } from "express";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import endPoints from "./post.endpoints.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";
import validation from "../../middleware/validatiob.middleware.js";
import * as postSchemas from "./post.validation.js";
import * as postServices from "./post.services.js";
import commentRouter from "../comment/comment.controller.js";

const router = Router();

// comment
router.use("/:postId/comment", commentRouter);

// create post
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoints.createPost),
  uploadCloud().array("images"),
  validation(postSchemas.createPost),
  postServices.createPost,
);

// update post
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized(endPoints.updatePost),
  uploadCloud().array("images"),
  validation(postSchemas.updatePost),
  postServices.updatePost,
);

// soft delete
router.patch(
  "/:id/freeze",
  isAuthenticated,
  isAuthorized(endPoints.freezePost),
  validation(postSchemas.freezePost),
  postServices.freezePost,
);

// restore post
router.patch(
  "/:id/unfreeze",
  isAuthenticated,
  isAuthorized(endPoints.unfreezePost),
  validation(postSchemas.unfreezePost),
  postServices.unfreezePost,
);

// get single post
router.get(
  "/:id",
  isAuthenticated,
  isAuthorized(endPoints.getPost),
  validation(postSchemas.getPost),
  postServices.getPost,
);

// get all active post
router.get(
  "/all/active",
  isAuthenticated,
  isAuthorized(endPoints.getActivePosts),
  validation(postSchemas.getActivePosts),
  postServices.getActivePosts,
);

// get all freezed post
router.get(
  "/all/freeze",
  isAuthenticated,
  isAuthorized(endPoints.getFreezedPosts),
  postServices.getFreezedPosts,
);

// like & unlike post
router.patch(
  ":id/like-unlike",
  isAuthenticated,
  isAuthorized(endPoints.likePost),
  validation(postSchemas.likePost),
  postServices.likePost,
);

export default router;
