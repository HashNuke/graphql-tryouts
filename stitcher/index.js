const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch');
const { HttpLink } = require('apollo-link-http');
const { locatedError } = require('graphql/error');

const graphql = require('graphql');
const Kind = graphql.Kind;
const responsePathAsArray = graphql.responsePathAsArray;

const {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
  introspectSchema
} = require('graphql-tools');

// const makeCustomRemoteExecutableSchema = require('./makeCustomRemoteExecutableSchema.js')

const schemaUrls = [
  "http://localhost:3000/graphql",
  "http://localhost:5000/graphql"
];


const getResponseKeyFromInfo = require('./node_modules/graphql-tools/dist/stitching/getResponseKeyFromInfo.js').getResponseKeyFromInfo;
const errors = require('./node_modules/graphql-tools/dist/stitching/errors.js');
const annotateWithChildrenErrors = errors.annotateWithChildrenErrors;


function concatErrors(errors) {
  return errors.map(error => error.message).join('\n');
}

function hasResult(error) {
  return error.result || error.extensions || (error.originalError && error.originalError.result);
}

class CombinedError extends Error {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
    }
}

function checkResultAndHandleErrors(result, info, responseKey) {
  if (!responseKey) {
    responseKey = getResponseKeyFromInfo(info);
  }

  console.log(responseKey);


  if (result.errors && (!result.data || result.data[responseKey] == null)) {
    // apollo-link-http & http-link-dataloader need the
    // result property to be passed through for better error handling.
    // If there is only one error, which contains a result property, pass the error through
    const newError =
      result.errors.length === 1 && hasResult(result.errors[0])
        ? result.errors[0]
        : new CombinedError(concatErrors(result.errors), result.errors);

    // IF you return, the parent function will expect
    // the return value to be the same structure as the graphql def for the field

    // return 'Hello ErrorTom';

    // locatedError allows returning only one error object
    // Errors need to be thrown for the parent function to format the response into the "errors" key
    throw locatedError(newError, info.fieldNodes, responsePathAsArray(info.path));
  }

  let resultObject = result.data[responseKey];
  if (result.errors) {
    resultObject = annotateWithChildrenErrors(resultObject, result.errors);
  }

  // This controls the data to be shown under the key for the field.
  // This return value cannot control the parent key's name/structure.

  // const myresult = "Hello Tom";
  // console.dir(myresult);
  // return myresult;

  return resultObject;
}


const customCreateResolver = function(fetcher) {
  console.log("Create custom resolver");

  return async (root, args, context, info) => {
    const fragments = Object.keys(info.fragments).map(
      fragment => info.fragments[fragment],
    );
    const doc = {
      kind: Kind.DOCUMENT,
      definitions: [info.operation].concat(fragments),
    };

    const result = await fetcher({
      query: doc,
      variables: info.variableValues,
      context: { graphqlContext: context },
    });

    return checkResultAndHandleErrors(result, info);
  };
}


const fetchSchema = async (url) => {
  const link = new HttpLink({ uri: url, fetch });
  const schema = await introspectSchema(link);

  return makeRemoteExecutableSchema({
    schema: schema,
    link: link,
    createResolver: customCreateResolver
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
