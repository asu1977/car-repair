import { gql } from 'apollo-boost';

export const carFragments = {
  car: gql`
    fragment CompleteCar on Car {
      _id
      name
      imageUrl
      category
      description
      instructions
      createdDate
      likes
      username
    }
  `,
  like: gql`
    fragment LikeCar on Car {
      _id
      likes
    }
  `
}