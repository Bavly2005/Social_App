import { Router } from "express";
import * as authServices from "./auth.services.js";
import * as authSchemas from "./auth.validation.js";
import { asyncHandler } from "../../utils/error handling/asyncHndler.js";
import validation from "../../middleware/validatiob.middleware.js";

const router = Router();

// send otp
router.post(
  "/verify",
  validation(authSchemas.sendOTP),
  asyncHandler(authServices.sendOTP),
);

// register
router.post(
  "/register",
  validation(authSchemas.register),
  asyncHandler(authServices.register),
);

// login
router.post(
  "/login",
  validation(authSchemas.login),
  asyncHandler(authServices.login),
);

// acctivate account
router.get(
  "/acctivate_account/:token",
  asyncHandler(authServices.acctivate_account),
);

// forget password
router.post(
  "/forget_password",
  validation(authSchemas.forgetPassword),
  asyncHandler(authServices.forgetPassword),
);

// reset password
router.post(
  "/reset_password",
  validation(authSchemas.resetPassword),
  asyncHandler(authServices.resetPassword),
);

// requset new access token
router.post(
  "/new_access",
  validation(authSchemas.newAccess),
  asyncHandler(authServices.newAccess),
);

// login with gmail
router.post(
  "/loginGmail",
  validation(authSchemas.loginWithGmail),
  asyncHandler(authServices.loginWithGmail),
);

export default router;
