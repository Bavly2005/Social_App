import { Router } from "express";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";
import validation from "../../middleware/validatiob.middleware.js";
import * as commentServices from "./comment.services.js";
import * as commentSchemas from "./comment.validation.js";
import endPoints from "./comment.endPoints.js";

const router = Router({ mergeParams: true });

// create
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoints.create),
  uploadCloud().single("images"),
  validation(commentSchemas.createComment),
  commentServices.createComment,
);

// update
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized(endPoints.update),
  uploadCloud().single("images"),
  validation(commentSchemas.updateComment),
  commentServices.updateComment,
);

// soft delete
router.patch(
  "/:id/delete",
  isAuthenticated,
  isAuthorized(endPoints.delete),
  validation(commentSchemas.deleteComment),
  commentServices.deleteComment,
);

// get all comments
router.get(
  "/",
  isAuthenticated,
  isAuthorized(endPoints.getAll),
  validation(commentSchemas.getAllComments),
  commentServices.getAllComments,
);

// like & unlike
router.patch(
  "/:id/like",
  isAuthenticated,
  isAuthorized(endPoints.like),
  validation(commentSchemas.likeComments),
  commentServices.likeComments,
);

// add reply
router.post(
  "/:id",
  isAuthenticated,
  isAuthorized(endPoints.addReply),
  uploadCloud().single("images"),
  validation(commentSchemas.addReply),
  commentServices.addReply,
);

// hard delete
router.delete(
  "/:id",
  isAuthenticated,
  isAuthenticated(endPoints.hardDelete),
  validation(commentSchemas.hardDelete),
  commentServices.hardDelete,
);

export default router;
