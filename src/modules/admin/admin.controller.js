import { Router } from "express";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import validation from "../../middleware/validatiob.middleware.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";
import endPoints from "./admin.endPoints.js";
import * as adminServices from "./admin.services.js";
import * as adminSchemas from "./admin.validation.js";
import { canChangeRole } from "./admin.middleware.js";

const router = Router();

// get all users and posts
router.get(
  "/",
  isAuthenticated,
  isAuthorized(endPoints.getAll),
  adminServices.getAll,
);

// change role
router.patch(
  "/role",
  isAuthenticated,
  isAuthorized(endPoints.changeRole),
  validation(adminSchemas.changeRole),
  canChangeRole,
  adminServices.changeRole,
);

export default router;
