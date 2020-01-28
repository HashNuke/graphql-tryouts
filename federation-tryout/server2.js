const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require("@apollo/federation");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Author {
  	id: ID
    name: String
    #genre: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    authors: [Author]
  }
`;

const authors = [
  {
    id: 1,
    name: 'J.K. Rowling',
    genre: "fiction"
  },
  {
    id: 2,
    name: 'Michael Crichton',
    genre: "fiction"
  },
];

const resolvers = {
  Query: {
    authors: () => authors,
  },
};

const schema = buildFederatedSchema([
  { typeDefs, resolvers }
])
const server = new ApolloServer({schema});

// The `listen` method launches a web server.
server.listen(4001).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
