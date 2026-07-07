export const typeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    description: String!
    content: String!
    author: String!
    coverImage: String
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getPosts(search: String, tag: String): [Post!]!
    getPost(id: ID!): Post
  }

  type Mutation {
    createPost(
      title: String!
      description: String!
      content: String!
      author: String
      coverImage: String
      tags: [String!]
    ): Post!
    deletePost(id: ID!): Boolean!
  }
`;
