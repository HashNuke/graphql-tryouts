from graphene import Schema
import graphql_defs
from graphql.utils.extend_schema import extend_schema
from graphql import parse as graphql_parse

ast = graphql_parse("""{
  extend type User {
    foo: String
  }
}
""")

schema = Schema(query=graphql_defs.Query)
schema = extend_schema(schema, ast)
