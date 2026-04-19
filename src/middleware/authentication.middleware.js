import User from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/error handling/asyncHndler.js";
import { verifyToken } from "../utils/token/token.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  // token frontend
  const { authorization } = req.headers; // token
  //    authorization >>> string

  // check token existence
  if (!authorization)
    return next(new Error("Token is required!", { cause: 403 }));

  // check if it is bearer
  if (!authorization.startsWith("Bearer"))
    return res.status(403).json({ success: false, message: "Invalid token!" });

  // extract token
  const token = authorization.split(" ")[1]; // >>> [Bearer, token] >>>> token
  // split() >>> seprate string in values and put them in array

  // verify token
  const { id } = verifyToken({ token });

  // check user
  const user = await User.findById(id).select("-password");
  if (!user) return next(new Error("User not found!", { cause: 400 }));

  if (!user.isLoggedIn) return next(new Error("Try to login again!"));

  req.user = user;
  return next();
});
export default isAuthenticated;
