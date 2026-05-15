import User from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/token.js";

export const isAuthenticated = (roles) => {
  return (resolver) => {
    return async (parent, args, context) => {
      // token frontend
      //   who are you ?
      const { authorization } = req.headers; // <Bearer>token
      //    authorization >>> string

      // check token existence
      if (!authorization) throw new Error("Token is required!", { cause: 403 });

      // check if it is bearer
      if (!authorization.startsWith("Bearer"))
        throw new Error("Invalid token!", { cause: 403 });

      // extract token
      const token = authorization.split(" ")[1]; // >>> [Bearer, token] >>>> token
      // split() >>> seprate string in values and put them in array

      // verify token
      const { id } = verifyToken({ token });

      // check user
      const user = await User.findById(id).select("-password").lean();
      if (!user) throw new Error("User not found!", { cause: 400 });

      if (!user.isLoggedIn) throw new Error("Try to login again!");

      //   check role
      if (roles?.length && !roles.includes(user.roles))
        throw new Error("Forbbiden!", { cause: 403 });

      context.user = user;
      return resolver(parent, args, context);
    };
  };
};
