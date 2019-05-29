const isEmptyObject = require('./node_modules/graphql-tools/dist/isEmptyObject.js').default;

const defaultMakeRemoteExecutableSchema = require('./node_modules/graphql-tools/dist/stitching/makeRemoteExecutableSchema.js');
const defaultCreateResolver = defaultMakeRemoteExecutableSchema.createResolver;


const customMergedResolver = require('./customMergedResolver.js');
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

const graphql = require('graphql');
const buildSchema = graphql.buildSchema;
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLFieldResolver = graphql.GraphQLFieldResolver;
const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLInterfaceType = graphql.GraphQLInterfaceType;
const GraphQLUnionType = graphql.GraphQLUnionType;
const GraphQLID = graphql.GraphQLID;
const GraphQLString = graphql.GraphQLString;
const GraphQLFloat = graphql.GraphQLFloat;
const GraphQLBoolean = graphql.GraphQLBoolean;
const GraphQLInt = graphql.GraphQLInt;
const GraphQLScalarType = graphql.GraphQLScalarType;
const printSchema = graphql.printSchema;

const linkToFetcher = require('./node_modules/graphql-tools/dist/stitching/linkToFetcher.js').default

exports.default = function makeCustomRemoteExecutableSchema({
  schema,
  link,
  fetcher,
  options 
}) {
  if (!fetcher && link) {
    fetcher = linkToFetcher(link);
  }

  options = typeof options !== 'undefined' ? options : {};

  if(options['createResolver'] == null) {
    options['createResolver'] = createDefaultResolver;
  }

  if(options['mergedResolver'] == null) {
    options['mergedResolver'] = customMergedResolver;
  }

  const customCreateResolver = options['createResolver'];
  const mergedResolver = options['mergedResolver'];

  let typeDefs;
  const printOptions = { commentDescriptions: true };

  if (typeof schema === 'string') {
    typeDefs = schema;
    schema = buildSchema(typeDefs);
  } else {
    // TODO fix types https://github.com/apollographql/graphql-tools/issues/542
    typeDefs = (printSchema)(schema, printOptions);
  }

  // prepare query resolvers
  const queryResolvers = {};
  const queryType = schema.getQueryType();
  const queries = queryType.getFields();
  Object.keys(queries).forEach(key => {
    queryResolvers[key] = customCreateResolver(fetcher);
  });

  // prepare mutation resolvers
  const mutationResolvers = {};
  const mutationType = schema.getMutationType();
  if (mutationType) {
    const mutations = mutationType.getFields();
    Object.keys(mutations).forEach(key => {
      mutationResolvers[key] = customCreateResolver(fetcher);
    });
  }

  //
  // WARNING/TODO We don't support subscriptions
  //
  // // prepare subscription resolvers
  const subscriptionResolvers = {};
  // const subscriptionType = schema.getSubscriptionType();
  // if (subscriptionType) {
  //   const subscriptions = subscriptionType.getFields();
  //   Object.keys(subscriptions).forEach(key => {
  //     subscriptionResolvers[key] = {
  //       subscribe: createSubscriptionResolver(key, link),
  //     };
  //   });
  // }

  // merge resolvers into resolver map
  const resolvers = { [queryType.name]: queryResolvers };

  if (!isEmptyObject(mutationResolvers)) {
    resolvers[mutationType.name] = mutationResolvers;
  }

  if (!isEmptyObject(subscriptionResolvers)) {
    resolvers[subscriptionType.name] = subscriptionResolvers;
  }

  // add missing abstract resolvers (scalar, unions, interfaces)
  const typeMap = schema.getTypeMap();
  const types = Object.keys(typeMap).map(name => typeMap[name]);
  for (const type of types) {
    if (
      type instanceof GraphQLInterfaceType ||
      type instanceof GraphQLUnionType
    ) {
      resolvers[type.name] = {
        __resolveType(parent, context, info) {
          return resolveParentFromTypename(parent, info.schema);
        },
      };
    } else if (type instanceof GraphQLScalarType) {
      if (
        !(
          type === GraphQLID ||
          type === GraphQLString ||
          type === GraphQLFloat ||
          type === GraphQLBoolean ||
          type === GraphQLInt
        )
      ) {
        resolvers[type.name] = recreateType(
          type,
          (name) => null,
          false,
        );
      }
    } else if (
      type instanceof GraphQLObjectType &&
      type.name.slice(0, 2) !== '__' &&
      type !== queryType &&
      type !== mutationType &&
      type !== subscriptionType
    ) {
      const resolver = {};
      Object.keys(type.getFields()).forEach(field => {
        console.log("customMergedResolver started")
        resolver[field] = customMergedResolver;
      });
      resolvers[type.name] = resolver;
    }
  }

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
}