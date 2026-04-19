import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

const chatSchema = new Schema(
  {
    users: {
      type: [{ type: Types.ObjectId, ref: "User" }],
      validate: {
        validator: function (value) {
          return value.length == 2;
        },
        message: "Users array must be 2 items!",
      },
    },
    message: [messageSchema],
  },
  { timestamps: true },
);

const Chat = model("Chat", chatSchema);

export default Chat;
