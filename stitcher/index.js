const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
var introspectSchema = require('./introspectSchema');
const {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  addMockFunctionsToSchema,
  mergeSchemas,
} = require('graphql-tools');
const { createApolloFetch } = require('apollo-fetch');


const fetcher = createApolloFetch({uri: 'http://localhost.charlesproxy.com:3000/graphql'});
const schema = (async function(){
  return makeRemoteExecutableSchema({
    schema: await introspectSchema(fetcher),
    fetcher,
  });
})();


schema.then(function(result) {
  const mergedSchema = mergeSchemas({
    schemas: [result],
  });

  const app = express();
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: mergedSchema }));
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  app.listen(4000, () => {
    console.log('Go to http://localhost:4000/graphiql to run queries!');
  });
});


// // Some fake data
// const books = [
//   {
//     title: "Harry Potter and the Sorcerer's stone",
//     author: 'J.K. Rowling',
//   },
//   {
//     title: 'Jurassic Park',
//     author: 'Michael Crichton',
//   },
// ];

// // The GraphQL schema in string form
// const typeDefs = `
//   type Query { books: [Book] }
//   type Book { title: String, author: String }
// `;

// // The resolvers
// const resolvers = {
//   Query: { books: () => books },
// };

// Put together a schema
// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
// });

// export const schema = mergeSchemas({
//   schemas: [chirpSchema, authorSchema],
// });

// Initialize the app
