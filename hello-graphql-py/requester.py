env_file = 'requester_env.py'

# Fetch users and posts
requests.post(base_url, gql="""
query {
  users {
    name
    authoredPosts {
      edges {
        node {
          id
          title
          createdAt
          usersWhoLiked {
            name
          }
          author {
            name
          }
        }
      }
    }
  }
}
""")