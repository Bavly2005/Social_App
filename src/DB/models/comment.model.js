import { Schema, Types, model } from "mongoose";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";

const commentSchema = new Schema(
  {
    post: { type: Types.ObjectId, ref: "Post", required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    text: {
      type: String,
      required: function () {
        return this.image ? false : true;
      },
    },
    image: { secure_url: String, public_id: String },
    deletedBy: { type: Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    parentComment: { type: Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true, toJSON: true, toObject: true },
);

// virtual populate
commentSchema.virtual("replies", {
  localField: "_id",
  foreignField: "parentComment",
  ref: "Comment",
});

// hooks
commentSchema.post(
  "deleteOne",
  { query: false, document: true },
  async function (doc, next) {
    // delete image cloudinary
    if (doc.image.secure_url) {
      await cloudinary.uploader.destroy(doc.image.public_id);
    }
    // doc ===== comment document
    const parentComment = doc._id;
    const replies = await this.constructor.find({ parentComment });
    if (replies.length) {
      for (const reply of replies) {
        await reply.deleteOne();
      }
    }
  },
);

// model
const Comment = model("Comment", commentSchema);

export default Comment;
