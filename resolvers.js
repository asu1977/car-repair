const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllCars: async (root, args, { Car }) => {
      const allCars = await Car.find().sort({ createdDate: 'desc' });
      return allCars;
    },
    getCar: async (root, { _id }, { Car }) => {
      const car = await Car.findOne({ _id });
      return car;
    },
    searchCars: async (root, { searchTerm }, { Car }) => {
      if (searchTerm) {
        const searchResults = await Car.find(
          {
            $text: { $search: searchTerm }
          },
          {
            score: { $meta: 'textScore' }
          }
        ).sort({
          score: { $meta: 'textScore' }
        });
        return searchResults;
      } else {
        const cars = await Car.find().sort({
          likes: 'desc',
          createdDate: 'desc'
        });
        return cars;
      }
    },
    getUserCars: async (root, { username }, { Car }) => {
      const userCars = await Car.find({ username }).sort({
        createdDate: 'desc'
      });
      return userCars;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: "favorites",
        model: "Car"
      });
      return user;
    }
  },
  Mutation: {
    addCar: async (
      root,
      { name, imageUrl, description, category, instructions, username },
      { Car }
    ) => {
      const newCar = await new Car({
        name,
        imageUrl,
        description,
        category,
        instructions,
        username
      }).save();
      return newCar;
    },
    likeCar: async (root, { _id, username }, { Car, User }) => {
      const car = await Car.findOneAndUpdate(
        { _id },
        { $inc: { likes: 1 } }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: _id } }
      );
      return car;
    },
    unlikeCar: async (root, { _id, username }, { Car, User }) => {
      const car = await Car.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: _id } }
      );
      return car;
    },
    deleteUserCar: async (root, {_id}, { Car }) => {
      const car = await Car.findOneAndRemove({ _id });
      return car;
    },
    updateUserCar: async (root, {_id, name, imageUrl, category, description}, {Car}) => {
      const updateUserCar = await Car.findOneAndUpdate(
        { _id },
        { $set: { name, imageUrl, category, description } },
        { new: true }
      );
      return updateUserCar;
    },
    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
      return { token: createToken(user, process.env.SECRET, '1hr') };
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists');
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, '1hr') };
    }
  }
};
