import { roles } from "../../DB/models/user.model.js";

const endPoints = {
  create: [roles.user],
  update: [roles.user],
  delete: [roles.user, roles.admin],
  getAll: [roles.user, roles.admin],
  like: [roles.user],
  addReply: [roles.user],
  hardDelete: [roles.user, roles.admin],
};

export default endPoints;
