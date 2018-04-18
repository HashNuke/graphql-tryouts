const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');

const url = 'http://graphql-tryout-rails.herokuapp.com/graphql';
const link = new HttpLink({ uri: url, fetch });

async function () {
  const schema = await introspectSchema(link);

  console.log("Remote schema fetched");
  return executableSchema = makeRemoteExecutableSchema({
    schema,
    link,
  });

}();

