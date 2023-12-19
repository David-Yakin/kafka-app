import UserInterface from "../interfaces/UserInterface";
import User from "../models/mongoose/User";

export const getUsersFromDB = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addNewUserToDb = async (normalizedUser: UserInterface) => {
  try {
    const user = new User(normalizedUser);
    const userFromDb = await user.save();

    return userFromDb;
  } catch (error) {
    return Promise.reject(error);
  }
};
