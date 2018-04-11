from flask import Flask, request
import graphene
from pprint import pprint
import json


class Query(graphene.ObjectType):
    hello = graphene.String(description='A typical hello world')

    def resolve_hello(self, info):
        return 'World'

schema = graphene.Schema(query=Query)
app = Flask(__name__)


def format_location(location):
    return {'line': location.line, 'column': location.column}

def format_error(error):
    locations = list(map(format_location, error.locations))
    return {
      'message': error.message,
      'locations': locations
    }

def format_response(graphql_result):
    response = {'data': graphql_result.data}
    if graphql_result.invalid:
        response['errors'] = list(map(format_error, graphql_result.errors))
    return json.dumps(response)


@app.route("/")
def hello():
    return "Hello World"


@app.route("/graphql", methods=['POST'])
def graphql():
    pprint(request.json)
    result = schema.execute(request.json['query'])
    return format_response(result)

