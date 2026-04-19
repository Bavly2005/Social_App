import User from "../../src/DB/models/user.model.js";
import { verifyToken } from "../../src/utils/token/token.js";

const socketAuth = async (socket, next) => {
  // token frontend
  const authorization = socket.handshake.auth.authorization; // token
  //    authorization >>> string

  // check token existence
  if (!authorization) return next(new Error("Token is required!"));

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
  if (!user) return next(new Error("User not found!"));

  if (!user.isLoggedIn) return next(new Error("Try to login again!"));

  socket.user = user;
  socket.id = user.id;
  return next();
};
export default socketAuth;
