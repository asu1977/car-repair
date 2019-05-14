exports.typeDefs = `

type Car {
  _id: ID
  name: String!
  imageUrl: String!
  category: String!
  description: String!
  instructions: String!
  createdDate: String
  likes: Int
  username: String
}

type User {
  _id: ID
  username: String! @unique
  password: String!
  email: String!
  joinDate: String
  favorites: [Car]
}

type Query {
  getAllCars: [Car]
  getCar(_id: ID!): Car
  searchCars(searchTerm: String): [Car]

  getCurrentUser: User
  getUserCars(username: String!): [Car]
}

type Token {
  token: String!
}

type Mutation {
  addCar(name: String!, imageUrl: String!, description: String!, category: String!, instructions: String!, username: String): Car
  deleteUserCar(_id: ID): Car
  updateUserCar(_id: ID!, name: String!, imageUrl: String!, description: String!, category: String!): Car
  likeCar(_id: ID!, username: String!): Car
  unlikeCar(_id: ID!, username: String!): Car
  signinUser(username: String!, password: String!): Token
  signupUser(username: String!, email: String!, password: String!): Token
}

`;
