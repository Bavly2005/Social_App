import path from "path";
import User, {
  defaultProfilePicture,
  defaultPublicID,
  defaultSecureURL,
} from "../../DB/models/user.model.js";
import { verifyEmail } from "../../utils/emails/generateHTML.js";
import sendEmails from "../../utils/emails/sendEmails.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { compareHash } from "../../utils/hash/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import fs from "fs";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";
import { asyncHandler } from "../../utils/error handling/asyncHndler.js";
import { areFriends, requestExist } from "./helpers/check.friends.js";

// profile
export const profile = async (req, res, next) => {
  // req.uesr >>> {_id, email, phone, isAcctivated, role}
  // const { user } = req;
  // decrypt phone
  // const phone = decrypt({ cipherText: user.phone });

  const user = await User.findById(req.user._id).populate("friends");

  return res.status(200).json({ success: true, result: user });
};

// update profile
export const updateProfile = async (req, res, next) => {
  const { user } = req;
  if (req.body.phone) {
    req.body.phone = encrypt({ plainText: req.body.phone });
  }
  const updateUser = await User.findByIdAndUpdate(
    user._id,
    { ...req.body },
    { new: true, runValidators: true },
  );

  return res.status(200).json({ success: true, results: { user: updateUser } });
};

// update email
export const updateEmail = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findById(req.user._id);

  if (!compareHash({ plainText: password, hash: user.password }))
    return next(new Error("Invalid Password!", { cause: 400 }));

  // new email ??
  // send email to new email (OTP, link)

  user.tempEmail = email;
  await user.save();

  const token = generateToken({ payload: { email, id: user._id } });
  const url = `http://localhost:3000/user/verify-email/${token}`;
  const html = verifyEmail(url);

  await sendEmails({ to: email, subject: "Email verifycation", html });

  return res.json({ success: true, message: "Verify your email!" });
};

// Verify Second Email
export const verifySecondEmail = async (req, res, next) => {
  const { token } = req.params;

  const { email, id } = verifyToken({ token });

  const user = await User.findById(id);

  if (!user) return res.json({ message: "User not found!" });

  user.email = user.tempEmail;
  user.tempEmail = null;
  await user.save();

  return res.json({ success: true, message: "Verified successfully!" });
};

// add profile picture
// export const profilePicture = async(req, res, next)=>{

// const user = await User.findByIdAndUpdate(
//                 req.user._id,
//                 { profilePicture: req.file.path },
//                 { new: true }
//         )

//         return res.json({ success: true, results: { user } })
// }

// add profile picture cloud
export const profilePicture = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id);

  // upload file in cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `users/${user._id}/profilePictures` },
  );

  // save link + id in user document
  user.profilePicture = { secure_url, public_id };
  await user.save();
  return res.json({ success: true, results: { user } });
};

// cover pics
export const coverPics = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.coverPics = req.files.map((file) => file.path);
  await user.save();

  return res.json({ success: true, results: { files: req.files } });
};

// delete profile picture
// export const deleteProfilePicture = async (req, res, next) => {
//         const user = await User.findById(req.user._id)
//         const imagePath = path.resolve(".", user.profilePicture)

//         fs.unlinkSync(imagePath)
//         user.profilePicture = defaultProfilePicture
//         user.save()
//         return res.json({ success: true, results: { user } })
// }

// delete profile picture cloud
export const deleteProfilePicture = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // delete user image from cloudinary
  const results = await cloudinary.uploader.destroy(
    user.profilePicture.public_id,
  );

  // put default profile picture to user
  if (results.result == "ok") {
    user.profilePicture = {
      public_id: defaultPublicID,
      secure_url: defaultSecureURL,
    };
    user.save();
  }
  return res.json({ success: true, results, user });
};

// update profile picture
export const updateProfilePicture = async (req, res, next) => {};

// send friend request
export const sendFriendRequest = asyncHandler(async (req, res, next) => {
  const { friendId } = req.params;
  const user = req.user;

  const friend = await User.findOne({ _id: friendId, freezed: false });
  if (!friend) return next(new Error("Invalid Id!"));

  if (areFriends(user, friend) || requestExist(user, friend))
    return next(new Error("Cannot Send request!"));

  // add friend request
  friend.friendRequests.push(user._id);
  await friend.save();

  return res.json({ success: true, message: "request sent successfully!" });
});

// accept friend request
export const acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const { friendId } = req.params;
  const user = req.body;

  const friend = await User.findOne({ _id: friendId, freezed: false });
  if (!friend) return next(new Error("Invalid Id!"));

  if (!areFriends(user, friend))
    return next(new Error("Cannot accept the request!"));

  friend.friendRequests.push(user._id);
  user.friendRequests.push(friend._id);
  user.friendRequests = user.friendRequests
    .map(String)
    .filter((id) => id !== friend.id);

  await friend.save();
  await user.save();

  return res.json({ success: true, message: "accepted successfully!" });
});
