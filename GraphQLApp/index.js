import express from "express";
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import expressPlayground from "graphql-playground-middleware-express";

const app = express();
const port = 3000;

// schema
const schema = new GraphQLSchema({
  // select, read, find
  query: new GraphQLObjectType({
    name: "QueryDemo", // string unique nospace required
    description: "short descrioption", // string optional
    fields: {
      // object
      // controller route  /login
      // service
      getUser: {
        type: GraphQLString,
        args: { id: { type: GraphQLNonNull(GraphQLID) } },
        resolve: (_, args) => {
          console.log(args);
          return "done";
        },
      },
      hello: {
        type: GraphQLString, // type of the return from resolve function
        resolve: () => {
          return "hi";
        },
      },
      test: {
        type: GraphQLInt,
        resolve: () => {
          return 10;
        },
      },
      testarr: {
        type: new GraphQLList(GraphQLInt), // array(the type of data in the arr)
        resolve: () => {
          return [10, 20, 30];
        },
      },
      testBool: {
        type: GraphQLBoolean,
        resolve: () => {
          return true;
        },
      },
      testObj: {
        type: new GraphQLObjectType({
          name: "test",
          fields: {
            name: { type: GraphQLString },
            age: { type: GraphQLInt },
          },
        }),
        resolve: () => {
          return { name: "Bavly", age: 20 };
        },
      },
    },
  }),
});

// one single url
app.all("/graphql", createHandler({ schema }));

app.get("/documentation", expressPlayground.default({ endpoint: "/graphql" }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
