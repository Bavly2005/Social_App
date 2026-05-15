// types of args of resolver
import { GraphQLID, GraphQLNonNull } from "graphql";

// one post
export const OnePostRequest = { id: { type: new GraphQLNonNull(GraphQLID) } };
