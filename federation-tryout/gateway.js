const express = require('express');
const app = express();

const { ApolloServer, gql } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  debug: true,
  serviceList: [
    { name: 'server1', url: 'http://localhost:4000/' },
    { name: 'server2', url: 'http://localhost:4001/' }
  ],
  // experimental_pollInterval: 5000
});

// const gateway = new ApolloGateway({
// 	serviceList: [
// 	  { name: "accounts", url: "https://pw678w138q.sse.codesandbox.io/" },
// 	  { name: "reviews", url: "https://0yo165yq9v.sse.codesandbox.io/" },
// 	  { name: "products", url: "https://x7jn4y20pp.sse.codesandbox.io/" },
// 	  { name: "inventory", url: "https://o5oxqmn7j9.sse.codesandbox.io/" }
// 	]
// });

const server = new ApolloServer({ gateway, subscriptions: false });
server.applyMiddleware({ app });

app.get('/reload-schemas', async (req, res) => {
  const { schema, executor } = await gateway.load();
  server.schema = schema;
  server.executor = executor;
  res.send(`🚀 Schema reloaded`);
});

app.listen({ port: 4002 }, () => {
  console.log(`🚀 Server ready at http://localhost:4002${server.graphqlPath}`);
});
