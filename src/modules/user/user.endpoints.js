import { roles } from "../../DB/models/user.model.js";

const endpoints = {
    profile: [roles.admin, roles.user],
    updateProfile: [roles.user],
    updatePassword: [roles.user],
    deactivateAccoune: [roles.user],
    updateEmail: [roles.user]
}

export default endpoints