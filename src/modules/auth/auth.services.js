import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User, { providers } from "../../DB/models/user.model.js";
import Randomstring from "randomstring";
import { emailEmitter } from "../../utils/emails/email.event.js";
import { compareHash, hash } from "../../utils/hash/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import { encrypt } from "../../utils/encryption/encryption.js";
import OTP from "../../DB/models/otp.model.js";
import { subjects } from "../../utils/emails/sendEmails.js";

// Create (register)
export const register = async (req, res, next) => {
  const { otp, email } = req.body;

  const otpExist = await OTP.findOne({ otp, email });

  if (!otpExist) return next(new Error("Invalid OTP!", { cause: 400 }));

  // create
  await User.create({
    ...req.body,
    isAcctivated: true,
  });
  // email (link)
  // emailEmitter.emit("sendEmial", req.body.email)

  return res.status(201).json({
    success: true,
    message: "User created successfully!",
  });
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // check email existance
  const user = await User.findOne({ email });
  if (!user) return next(new Error("Invalid user!", { cause: 400 }));

  // check if account is active
  if (!user.isAcctivated)
    return next(new Error("You must acctivate your account first!"));

  // check password
  // if(!bcrypt.compareSync(password, user.password)
  if (!compareHash({ plainText: password, hash: user.password }))
    return next(new Error("Invalid password!", { cause: 400 }));

  return res.status(200).json({
    success: true,
    message: "success login",
    access_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
    refresh_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    }),
  });
};

// acctivate account
export const acctivate_account = async (req, res, next) => {
  // who are you
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ email });
  if (!user) return next(new Error("Document not found!", { cause: 404 }));

  user.isAcctivated = true;
  await user.save();

  if (!user.isAcctivated)
    return next(
      new Error("You must acctivate your account first!", { cause: 400 }),
    );

  return res.status(200).json({ success: true, message: "try to login!" });
};

//  send OTP
export const sendOTP = async (req, res, next) => {
  const { email } = req.body;

  // check uesr
  const user = await User.findOne({ email });
  if (user) return next(new Error("User alredy exist!"));

  // generate OTP
  const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });

  await OTP.create({ email, otp });

  emailEmitter.emit("sendEmial", email, otp, subjects.register);

  return res.json({ success: true, message: "OTP send successfully!" });
};

// forget password
export const forgetPassword = async (req, res, next) => {
  // data
  const { email } = req.body;

  const user = await User.findOne({ email, isAcctivated: true });
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  const otp = Randomstring.generate({ length: 6, charset: "alphabetic" });
  await OTP.create({ email, otp });

  emailEmitter.emit("sendEmail", email, otp, subjects.forgetPassword);

  return res.json({ success: true, message: "OTP send successfully!" });
};

// reset password
export const resetPassword = async (req, res, next) => {
  //    data
  const { email, password, otp } = req.body;

  const user = await User.findOne({ email, isAcctivated: true });
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  const otpExist = await OTP.findOne({ otp, email });
  if (!otpExist) return next(new Error("Invalid OTP!", { cause: 400 }));

  user.password = password;
  await user.save();

  return res.json({ success: true, message: "Try to login now! " });
};

//  new access
export const newAccess = async (req, res, next) => {
  const { refresh_token } = req.body;

  const payload = verifyToken({ token: refresh_token });

  const user = await User.findById(payload.id);
  if (!user) return next(new Error("User not existed!", { cause: 404 }));

  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });

  return res.json({ success: true, results: { access_token } });
};

// login with gmail
export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }

  const userData = await verify();
  const { email_verified, email, name, picture } = userData;

  if (!email_verified) return next(new Error("Email is inavalid!"));

  // creation
  const user = await User.create({
    email,
    userName: name,
    isAcctivated: true,
    provider: providers.google,
  });

  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });

  const refresh_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  });

  return res.json({ success: true, results: { access_token, refresh_token } });
};
