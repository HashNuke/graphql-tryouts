const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');

const url = 'http://graphql-tryout-rails.herokuapp.com/graphql';
const link = new HttpLink({ uri: url, fetch });

const schema = async function () {
  const schema = await introspectSchema(link);

  return executableSchema = makeRemoteExecutableSchema({
    schema,
    link,
  });


}();

console.log("Remote schema fetched");