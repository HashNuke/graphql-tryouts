const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const fetch = require('node-fetch');
const { HttpLink } = require('apollo-link-http');
// var introspectSchema = require('./introspectSchema');
const {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  addMockFunctionsToSchema,
  mergeSchemas,
  introspectSchema
} = require('graphql-tools');

const url = "http://graphql-tryout-rails.herokuapp.com/graphql";
const link = new HttpLink({ uri: url, fetch });

(async function(){
  var schema = await introspectSchema(link)

  return makeRemoteExecutableSchema({
    schema: schema,
    link,
  });
})().then(function(result) {
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
