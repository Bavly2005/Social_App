import Chat from "../../src/DB/models/chat.model.js";
import User from "../../src/DB/models/user.model.js";

export const sendMessage = function (socket, io) {
  return async ({ message, to }) => {
    const friendId = to;
    const user = socket.user;
    const content = message;

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

    socket.to(to).emit("successMessage", { message, from: socket.id });
  };
};
