env_file = 'requester_env.py'

requests.post("http://localhost:5000/graphql", gql="""
{
  hello
}
""")


requests.post("http://localhost:5000/graphql", gql="""
{
  hello|
}
""")