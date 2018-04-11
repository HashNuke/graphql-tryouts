from flask import Flask, request
from pprint import pprint
import json
import graphql_defs
from graphene import Schema
from models import create_session

schema = Schema(query=graphql_defs.Query)
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
    result = schema.execute(request.json['query'], context_value={'session': create_session()})
    return format_response(result)

