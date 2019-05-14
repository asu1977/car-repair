import { gql } from 'apollo-boost';

import { carFragments } from './fragments';

/* Cars Queries */
export const GET_ALL_CARS = gql`
  query {
    getAllCars {
      _id
      imageUrl
      name
      category
    }
  }
`;

export const GET_CAR = gql`
  query($_id: ID!) {
    getCar(_id: $_id) {
      ...CompleteCar
    }
  }
  ${carFragments.car}
`;

export const SEARCH_CARS = gql`
  query($searchTerm: String) {
    searchCars(searchTerm: $searchTerm) {
      _id
      name
      likes
    }
  }
`;

/* Cars Mutations */

export const ADD_CAR = gql`
  mutation(
    $name: String!
    $imageUrl: String!
    $description: String!
    $category: String!
    $instructions: String!
    $username: String
  ) {
    addCar(
      name: $name
      imageUrl: $imageUrl
      description: $description
      category: $category
      instructions: $instructions
      username: $username
    ) {
      ...CompleteCar
    }
  }
  ${carFragments.car}
`;

export const LIKE_CAR = gql`
  mutation($_id: ID!, $username: String!) {
    likeCar(_id: $_id, username: $username) {
      ...LikeCar
    }
  }
  ${carFragments.like}
`;

export const UNLIKE_CAR = gql`
  mutation($_id: ID!, $username: String!) {
    unlikeCar(_id: $_id, username: $username) {
      ...LikeCar
    }
  }
  ${carFragments.like}
`;

export const DELETE_USER_CAR = gql`
  mutation($_id: ID!) {
    deleteUserCar(_id: $_id) {
      _id
    }
  }
`;

export const UPDATE_USER_CAR = gql`
  mutation($_id: ID!, $name: String!, $imageUrl: String!, $description: String!, $category: String!) {
    updateUserCar(_id: $_id, name: $name, imageUrl: $imageUrl, description: $description, category: $category) {
      _id
      name
      likes
      category
      imageUrl
      description
    }
  }
`;

/* User Queries */

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
      joinDate
      email
      favorites {
        _id
        name
      }
    }
  }
`;

export const GET_USER_CARS = gql`
  query($username: String!) {
    getUserCars(username: $username) {
      _id
      name
      likes
      imageUrl
      category
      description
    }
  }
`;

/* User Mutations */

export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
