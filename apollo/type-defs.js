import gql from "graphql-tag";

export const typeDefs = gql`
  type Product {
    name: String
    averageRating: Float
    reviewCount: Int
  }
  type Customer {
    name: String
    email: String
  }
  type Review {
    id: Int!
    rating: Int
    title: String
    content: String
    customer: Customer
    product: Product
    status: String
    date: String
  }
  type Settings {
    autoPublish: Boolean
    emailNotifications: Boolean
    email: String
  }
  type Query {
    reviews: [Review]
    review(id: Int!): Review
    settings: Settings
  }
  type Mutation {
    updateSettings(
      autoPublish: Boolean
      emailNotifications: Boolean
      email: String
    ): Settings
  }
`;
