const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const { MONGODB } = require("./config.js");

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });
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
