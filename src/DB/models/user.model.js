import { Schema, Types, model } from "mongoose";
import { hash } from "../../utils/hash/hash.js";

export const defaultProfilePicture =
  "/uploads/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg";

export const defaultSecureURL =
  "https://res.cloudinary.com/dowvpmwup/image/upload/v1771707960/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use_gknf9v.webp";

export const defaultPublicID =
  "depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use_gknf9v";

export const roles = {
  superadmin: "superadmin",
  admin: "admin",
  user: "user",
};

export const providers = {
  system: "system",
  google: "google",
};

// Schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "Email already existed !"],
      lowercase: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true : false;
      },
    },
    userName: {
      type: String,
      minlength: 5,
      maxlength: 15,
      required: true,
      unique: true,
    },
    isAcctivated: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: String,
      enum: Object.values(roles),
      default: roles.user,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    freezed: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },
    tempEmail: { type: String, default: null },
    // profilePicture: { type: String, default: defaultProfilePicture},// default or required System
    profilePicture: {
      // cloud
      secure_url: { type: String, default: defaultSecureURL },
      public_id: { type: String, default: defaultPublicID },
    },
    friends: [{ type: Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Types.ObjectId, ref: "User" }],
    coverPics: [String],
  },
  { timestamps: true },
);

// doc.save  >>>> uesr.save
userSchema.pre("save", async function () {
  // hash password
  // this >>> document >>> user document
  // ex: password = 123456
  if (this.isModified("password")) {
    this.password = hash({ plainText: this.password });
  }
});

// model
const User = model("User", userSchema);
export default User;
