const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

const url = 'http://graphql-tryout-rails.herokuapp.com/graphql';

// USING HttpLink
// const link = new HttpLink({ uri: url, fetch });

// Using apollo-fetch
// const { createApolloFetch } = require('apollo-fetch');
// const fetcher = createApolloFetch({uri: url});


// Using node-fetch
const fetcher = async ({ query, variables, operationName, context }) => {
  const fetchResult = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables, operationName })
  });
  return fetchResult.json();
};


(async function () {
  var schema = await introspectSchema(fetcher);

  return makeRemoteExecutableSchema({
    schema: schema,
    fetcher,
  });

  console.log("Remote schema fetched");
})();
