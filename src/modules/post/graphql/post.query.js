// all query fields of posts
// (get, read, find)

import * as postServices from "./types/post.graphql.services.js";
import {
  AllPostsResponse,
  OnePostResponse,
} from "./types/post.types.response.js";
import { OnePostRequest } from "./types/post.types.request.js";
import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { isAuthenticated } from "../../../GraphQL/authentication.js";
import { validation } from "../../../GraphQL/validation.js";
import { allMiddleware } from "../../../GraphQL/allFunctions.js";
import { OnePostSchema } from "./post.graphql.validation.js";

export const PostQuery = {
  onePost: {
    type: new GraphQLObjectType({
      name: "OnePostResponse",
      fields: {
        success: { type: GraphQLBoolean },
        statusCode: { type: GraphQLInt },
        results: { type: OnePostResponse },
      },
    }),
    args: OnePostRequest,
    // resolve: validation(OnePostSchema)(
    //   isAuthenticated(["admin"])(postServices.onePost),
    // ),
    resolve: allMiddleware(
      postServices.onePost, // first element the basic resolve
      isAuthenticated(["admin"]),
      validation(OnePostSchema),
    ),
  },
  allPosts: {
    type: new GraphQLObjectType({
      name: "AllPostsResponse",
      fields: {
        success: { type: GraphQLBoolean },
        statusCode: { type: GraphQLInt },
        results: { type: AllPostsResponse },
      },
    }),
    resolve: postServices.allPosts,
  },
  //   allDeletedPosts,
};
