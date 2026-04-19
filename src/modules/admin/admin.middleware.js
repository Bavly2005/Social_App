import User, { roles } from "../../DB/models/user.model.js";

export const canChangeRole = async (req, res, next) => {
  const allRoles = Object.values(roles);

  const userReq = req.body;
  const targetUser = await User.findById(req.body.userId);

  const userReqRole = userReq.roles;
  const targetUserRole = targetUser.roles;

  const userReqIndex = allRoles.indexOf(userReqRole);
  const targetUserIndex = allRoles.indexOf(targetUserRole);

  const canModify = userReqIndex < targetUserIndex;

  if (!canModify)
    return next(new Error("You are not allowed to modify the role!"));

  return next();
};
