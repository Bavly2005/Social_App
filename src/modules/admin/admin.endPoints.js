import { roles } from "../../DB/models/user.model.js";

const endPoints = {
  getAll: [roles.superadmin, roles.admin],
  changeRole: [roles.superadmin, roles.admin],
};

export default endPoints;
