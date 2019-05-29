const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch');
const { HttpLink } = require('apollo-link-http');

const {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
  introspectSchema
} = require('graphql-tools');

const schemaUrls = [
  "http://localhost:3000/graphql",
  "http://localhost:5000/graphql"
];


const fetchSchema = async (url) => {
  const link = new HttpLink({ uri: url, fetch });
  const schema = await introspectSchema(link);

  return makeRemoteExecutableSchema({
    schema: schema,
    link,
  });
};


const schemaFetchPromises = schemaUrls.map(fetchSchema);

Promise.all(schemaFetchPromises).then((schemas) => {
  const mergedSchema = mergeSchemas({
    schemas: schemas,
  });

  const server = new ApolloServer({schema: mergedSchema });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
