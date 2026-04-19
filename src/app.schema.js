import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { PostQuery } from "./modules/post/graphql/post.query.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "schema",
    fields: {
      // getters of posts
      ...PostQuery,
      // getters of users
      // getters of comments
    },
  }),
  // mutation:,
  // subscription:
});
