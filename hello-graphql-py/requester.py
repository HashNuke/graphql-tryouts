env_file = 'requester_env.py'

# Good request to start off tryouts
requests.post("http://localhost:5000/graphql", gql="""
{
  hello
}
""")

# Bad request with syntax error
requests.post("http://localhost:5000/graphql", gql="""
{
  hello|
}
""")


# Fetch users
requests.post("http://localhost:5000/graphql", gql="""
query {
  users {
    name
    authoredPosts {
      edges {
        node {
          id
          title
        }
      }
    }
  }
}
""")