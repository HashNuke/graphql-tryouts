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

  // console.log("RESULT", introspectionResult);
  // console.log("===========");

  var definition = "type Mutation {\n  # An example field added by the generator\n  testField: String\n}\n\n# An object with an ID.\ninterface Node {\n  # ID of the object.\n  id: ID!\n}\n\n# Information about pagination in a connection.\ntype PageInfo {\n  # When paginating forwards, the cursor to continue.\n  endCursor: String\n\n  # When paginating forwards, are there more items?\n  hasNextPage: Boolean!\n\n  # When paginating backwards, are there more items?\n  hasPreviousPage: Boolean!\n\n  # When paginating backwards, the cursor to continue.\n  startCursor: String\n}\n\ntype Query {\n  allUsers(\n    # Returns the elements in the list that come after the specified global ID.\n    after: String\n\n    # Returns the elements in the list that come before the specified global ID.\n    before: String\n\n    # Returns the first _n_ elements from the list.\n    first: Int\n\n    # Returns the last _n_ elements from the list.\n    last: Int\n  ): UserConnection\n\n  # Fetches an object given its ID.\n  node(\n    # ID of the object.\n    id: ID!\n  ): Node\n\n  # Fetches a list of objects given a list of IDs.\n  nodes(\n    # IDs of the objects.\n    ids: [ID!]!\n  ): [Node]!\n\n  # An example field added by the generator\n  testField: String\n}\n\ntype User implements Node {\n  id: ID!\n\n  # The name of the User\n  name: String\n}\n\n# The connection type for User.\ntype UserConnection {\n  # A list of edges.\n  edges: [UserEdge]\n\n  # Information to aid in pagination.\n  pageInfo: PageInfo!\n}\n\n# An edge in a connection.\ntype UserEdge {\n  # A cursor for use in pagination.\n  cursor: String!\n\n  # The item at the end of the edge.\n  node: User\n}";
  if (
    (introspectionResult.errors && introspectionResult.errors.length) ||
    !introspectionResult.data.__schema
  ) {
    throw introspectionResult.errors;
  } else {
    // const schema = buildClientSchema(definition);
    return definition;
  }
}