const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

const url = 'http://graphql-tryout-rails.herokuapp.com/graphql';
const link = new HttpLink({ uri: url, fetch });

// const { createApolloFetch } = require('apollo-fetch');
// const fetcher = createApolloFetch({uri: url});

(async function () {
  var schema = await introspectSchema(link);

  return makeRemoteExecutableSchema({
    schema: schema,
    link,
  });

  console.log("Remote schema fetched");
})();
