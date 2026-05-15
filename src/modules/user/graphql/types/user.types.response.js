import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from "graphql";
import { imageType } from "../../../../utils/graphql/image.type.js";

export const OneUserResponse = new GraphQLObjectType({
  name: "OneUser",
  fields: {
    email: { type: GraphQLString },
    userName: { type: GraphQLString },
    profilePicture: { type: imageType },
    coverPics: { type: new GraphQLList(imageType) },
    _id: { type: GraphQLID },
  },
});
