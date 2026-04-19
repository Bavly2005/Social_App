import User from "../../DB/models/user.model.js";
import Chat from "../../DB/models/chat.model.js";
import { asyncHandler } from "../../utils/error handling/asyncHndler.js";

export const getChat = asyncHandler(async (req, res, next) => {
  const { friendId } = req.params;
  const user = req.user;

  const friend = await User.findOne({ _id: friendId, freezed: false });
  if (!friend) return next(new Error("Invalid Id!"));

  const chat = await Chat.findOne({
    users: { $all: [friendId, user._id] },
  }).populate("users");

  return res.json({ success: true, results: { chat } });
});

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { friendId } = req.params;
  const user = req.user;
  const { content } = req.body;

  const friend = await User.findOne({ _id: friendId, freezed: false });
  if (!friend) return next(new Error("Invalid Id!"));

  let chat = await Chat.findOne({ users: { $all: [friendId, user._id] } });

  if (!chat) {
    chat = await Chat.create({
      users: [friendId, user._id],
      message: [{ sender: user._id, content }],
    });
  } else {
    chat.message.push({ sender: user._id, content });
    await chat.save();
  }

  let chatPopulated = await Chat.findOne({
    users: { $all: [friendId, user._id] },
  }).populate("users");

  return res.json({ success: true, results: { chat: chatPopulated } });
});
