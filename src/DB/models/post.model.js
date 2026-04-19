import { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    text: {
      type: String,
      minlength: 2,
      required: function () {
        return this.images.length ? false : true;
      },
    },
    images: [{ secure_url: String, public_id: String }],
    user: { type: Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: Types.ObjectId, ref: "User" },
    cloudFolder: {
      type: String,
      unique: true,
      required: function () {
        return this.images.length ? true : false;
      },
    },
  },
  { timestamps: true, toJSON: true, toObject: true },
);

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

postSchema.query.paginate = async function (page) {
  page = page ? page : 1;
  const limit = 4;
  const skip = limit - (page - 1);
  const data = await this.skip(skip).limit(limit);
  const items = await this.model.countDocuments();

  return {
    data,
    currentPage: Number(page),
    totalItems: items,
    totalPages: Math.ceil(items / limit),
    itemsPerPage: data.length,
  };
};

const Post = model("Post", postSchema);

export default Post;
