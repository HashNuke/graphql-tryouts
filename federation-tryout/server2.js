const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Author {
  	id: ID
    name: String
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
  },
  {
    id: 2,
    author: 'Michael Crichton',
  },
];

const resolvers = {
  Query: {
    authors: () => authors,
  },
};

port = 4001
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});