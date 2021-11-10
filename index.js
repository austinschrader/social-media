const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose");

const Post = require("./models/Post");
const User = require("./models/User");

const { MONGODB } = require("./config.js");

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    userName: String!
  }
  type Query {
    getPosts: [Post]
  }
`;

const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: 5000 });
  console.log(`Server ready at ${url}`);
}

mongoose
  .connect(MONGODB)
  .then(() => {
    console.log("Connected to MongoDB");
    startApolloServer(typeDefs, resolvers);
  })
  .then(() => {
    console.error("Error while connecting to MongoDB");
  });
