const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
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

const linkDefs = `
  extend type User {
    posts: Post
  }
`;

const fetchSchema = async (url) => {
  const link = new HttpLink({ uri: url, fetch });
  const schema = await introspectSchema(link);

  return makeRemoteExecutableSchema({
    schema: schema,
    link,
  });
};

const resolverForPostsByUserId = (mergeInfo) => {
  console.log("Creating resolver for POSTS");
  (parent, args, context, info) => {
    const userId = parent.id;
    console.log("Running resolver for POSTS");

    return mergeInfo.delegate(
      'query',
      'postsByUserId',
      {
        userId,
      },
      context,
      info,
    );
  }
};

const crossResolvers = (mergeInfo) => ({
  User: {
    posts: {
      // fragment: "fragment UserFragment on User { id }",
      resolve: resolverForPostsByUserId(mergeInfo)
    }
  }
});

const schemaFetchPromises = schemaUrls.map(fetchSchema);
Promise.all(schemaFetchPromises).then((schemas) => {
  schemas.push(linkDefs);
  const mergedSchema = mergeSchemas({
    schemas: schemas,
    resolvers: crossResolvers
  });

  const app = express();
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({ schema: mergedSchema })
  );
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  app.listen(4000, () => {
    console.log('Go to http://localhost:4000/graphiql to run queries!');
  });
});
