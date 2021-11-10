const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose");

const { MONGODB } = require("./config.js");

const typeDefs = gql`
  type Query {
    sayHello: String!
  }
`;

const resolvers = {
  Query: {
    sayHello: () => "Hello, World - from Austin!",
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
