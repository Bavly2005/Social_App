import { roles } from "../../DB/models/user.model.js";

const endPoints = {
    createPost: [roles.user],
    updatePost: [roles.user],
    freezePost: [roles.user, roles.admin],
    unfreezePost: [roles.user, roles.admin],
    getPost: [roles.user, roles.admin],
    getActivePosts: [roles.user, roles.admin],
    getFreezedPosts: [roles.user, roles.admin],
    likePost: [roles.user]
}

export default endPoints