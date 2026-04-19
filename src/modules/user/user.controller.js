import { Router } from "express";
import * as userServices from "./user.services.js";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import validation from "../../middleware/validatiob.middleware.js";
import endpoints from "./user.endpoints.js";
import { fileValidation } from "../../utils/file uploading/multerUpload.js";
import * as userShcema from "./user.validation.js";
import { upload } from "../../utils/file uploading/multerUpload.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";

const router = Router();

// profile
router.get(
  "/profile",
  isAuthenticated,
  isAuthorized(endpoints.profile),
  userServices.profile,
);

// update profile
router.patch(
  "/profile",
  isAuthenticated,
  isAuthorized(endpoints.updateProfile),
  validation(userShcema.updateProfile),
  userServices.updateProfile,
);

// update password

// deactivate account

// update email
router.patch(
  "/update-email",
  isAuthenticated,
  isAuthorized(endpoints.updateEmail),
  validation(userShcema.updateEmail),
  userServices.updateEmail,
);

// email verification
router.get("/verify-email/:token", userServices.verifySecondEmail);

// add profile picture
// router.post(
//     "/profilePicture",
//     isAuthenticated,
//     upload(fileValidation.images, "uploads/users").single("image"),
//     asyncHandler(userServices.profilePicture),
// )

// add profile picture cloud
router.post(
  "/profilePicture",
  isAuthenticated,
  uploadCloud().single("image"),
  userServices.profilePicture,
);

// add cover pics
router.post(
  "/coverPics",
  isAuthenticated,
  upload(fileValidation.images, "uploads/users").array("images"),
  userServices.coverPics,
);

// delete profile picture
router.delete(
  "/deleteProfilePicture",
  isAuthenticated,
  userServices.deleteProfilePicture,
);

// update profile picture
router.post(
  "/updateProfilePicture",
  isAuthenticated,
  upload(fileValidation.images, "uploads/users").single("image"),
  userServices.updateProfilePicture,
);

// send friend request
router.post(
  "/friend-request/:friendId",
  isAuthenticated,
  validation(userShcema.sendFriendRequest),
  userServices.sendFriendRequest,
);

// accept friend request
router.post(
  "/friend-request/:friendId/accept",
  isAuthenticated,
  validation(userShcema.acceptFriendRequest),
  userServices.acceptFriendRequest,
);

export default router;
