// types of return from resolver
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { imageType } from "../../../../utils/graphql/image.type.js";
import { OneUserResponse } from "../../../user/graphql/types/user.types.response.js";

// One Post
export const OnePostResponse = new GraphQLObjectType({
  name: "OnePost",
  fields: {
    text: { type: GraphQLString },
    images: { type: new GraphQLList(imageType) },
    user: { type: OneUserResponse },
    likes: { type: new GraphQLList(GraphQLID) },
    isDeleted: { type: GraphQLBoolean },
    deletedBy: { type: GraphQLID },
    _id: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

// All Posts
export const AllPostsResponse = new GraphQLList(OnePostResponse);
