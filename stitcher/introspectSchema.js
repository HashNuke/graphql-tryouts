const { GraphQLSchema, DocumentNode } = require('graphql');
const { introspectionQuery, buildClientSchema, parse } = require('graphql');
const { ApolloLink } = require('apollo-link');
const { Fetcher } = require('graphql-tools/dist/stitching/makeRemoteExecutableSchema');
const linkToFetcher = require('graphql-tools/dist/stitching/linkToFetcher').default;


// module.exports = {hello: "Hello world"};
module.exports = async function introspectSchema(fetcher, linkContext) {

  // Convert link to fetcher
  if (fetcher.request) {
    fetcher = linkToFetcher(fetcher);
  }

  const introspectionResult = await (fetcher)({
    query: introspectionQuery,
    context: linkContext,
  });

  console.log("RESULT", introspectionResult);

  if (
    (introspectionResult.errors && introspectionResult.errors.length) ||
    !introspectionResult.data.__schema
  ) {
    throw introspectionResult.errors;
  } else {
    const schema = buildClientSchema(introspectionResult.data);
    return schema;
  }
}