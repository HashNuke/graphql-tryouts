env_file = 'requester_env.py'

# Fetch users and posts
requests.post(base_url, gql="""
query {
  users {
    id
    name
    authoredPosts {
      edges {
        cursor
        node {
          id
          title
          createdAt
          usersWhoLiked {
            name
            createdAt
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


# Fetch users and posts
requests.post(base_url, gql="""
query {
  node(id: "VXNlclR5cGU6MQ==") {
    ... on UserType {
      name
      authoredPosts(first: 3, after: "YXJyYXljb25uZWN0aW9uOjE=") {
        edges {
          cursor
          node {
            id
            title
          }
        }
      }
    }
  }
}
""")