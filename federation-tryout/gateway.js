const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  debug: true,
  serviceList: [
    { name: 'server1', url: 'http://localhost:4000/' },
    { name: 'server2', url: 'http://localhost:4001/' }
  ]
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
server.listen(4002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});;