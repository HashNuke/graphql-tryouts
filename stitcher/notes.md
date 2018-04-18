Schema stitching for different GraphQL frameworks

Hello all,

I was trying to use an apollo-graphql server to schema-stitch the following:

* Python GraphQL server using graphene
* Ruby GraphQL server using graphql-ruby

So in theory, a node.js GraphQL server, powered by Apollo GraphQL, would front two (or more) GraphQL servers.

I came across `makeRemoteExecutableSchema` function provided by `graphql-tools`. It sends the parsed GraphQL query, down-stream to the next GraphQL server.

So for a query like this:

```graphql
{
  testField
}
```

The down-stream GraphQL server will get a query as JSON like the following:


```javascript
{
  "query": {
    "kind": "Document",
    "definitions": [
      {
        "kind": "OperationDefinition",
        "operation": "query",
        "variableDefinitions": [

        ],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [
            {
              "kind": "Field",
              "alias": null,
              "arguments": [

              ],
              "name": {
                "kind": "Name",
                "value": "testField"
              }
...
-- REMOVED TO SHORTEN MESSAGE --
```

On reading through the code it looks like `createResolver` in `makeRemoteExecutableSchema`.

Is there any possibility of interop between GraphQL frameworks to help with schema stitching?
