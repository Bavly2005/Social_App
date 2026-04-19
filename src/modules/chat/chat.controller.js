import { Router } from "express";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import validation from "../../middleware/validatiob.middleware.js";
import * as chatServices from "./chat.services.js";
import * as chatShcemas from "./chat.validation.js";
const router = Router();

// get chat
router.get(
  "/:friendId",
  isAuthenticated,
  validation(chatShcemas.getChat),
  chatServices.getChat,
);
// send message
router.post(
  "/message/:friendId",
  isAuthenticated,
  validation(chatShcemas.sendMessage),
  chatServices.sendMessage,
);
export default router;
