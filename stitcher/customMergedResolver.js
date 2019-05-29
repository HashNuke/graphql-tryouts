const graphql = require('graphql');
const GraphQLFieldResolver = graphql.GraphQLFieldResolver;
const responsePathAsArray = graphql.responsePathAsArray;
const locatedError = require('graphql/error');

// const errors = require('errors');
// const getErrorsFromParent = errors.getErrorsFromParent;
// const annotateWithChildrenErrors = errors.annotateWithChildrenErrors;

const getResponseKeyFromInfo = require('./node_modules/graphql-tools/dist/stitching/getResponseKeyFromInfo.js').getResponseKeyFromInfo;

// Resolver that knows how to:
// a) handle aliases for proxied schemas
// b) handle errors from proxied schemas
const customMergedResolver = (parent, args, context, info) => {
  console.log("CUSTOM MERGE RESOLVER")
  if (!parent) {
    return null;
  }
  debugger;

  const responseKey = getResponseKeyFromInfo(info);
  const errorResult = getErrorsFromParent(parent, responseKey);

  if (errorResult.kind === 'OWN') {
    throw locatedError(new Error(errorResult.error.message), info.fieldNodes, responsePathAsArray(info.path));
  }

  let result = parent[responseKey];

  // subscription result mapping
  if (!result && parent.data && parent.data[responseKey]) {
    result = parent.data[responseKey];
  }

  if (errorResult.errors) {
    result = annotateWithChildrenErrors(result, errorResult.errors);
  }
  return result;
};

exports.default = customMergedResolver;
