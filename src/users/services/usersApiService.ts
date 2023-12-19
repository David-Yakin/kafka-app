import UserInterface, { LoginInterface } from "../interfaces/UserInterface";
// import { comparePassword, generateUserPassword } from "../helpers/bcrypt";
// import { generateAuthToken } from "../../auth/providers/jwt";
import { addNewUserToDb, getUsersFromDB } from "../dataAccess/usersDAL";
import User from "../models/mongoose/User";
import {
  normalizedUsersForCache,
  normalizeUserForCache,
} from "../helpers/normalizeUserForCache";

export const getUsers = async () => {
  try {
    const users = await getUsersFromDB();
    const normalizedUsers = normalizedUsersForCache(users);
    if (!users) throw new Error("no users in the database");
    return users;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const register = async (userFromClient: UserInterface) => {
  try {
    const isUserExist = await User.findOne({ email: userFromClient.email });
    if (isUserExist) throw new Error("User already exists");

    const user = await addNewUserToDb(userFromClient);

    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

// export const editUser = async (
//   userId: string,
//   userForUpdate: UserInterface
// ) => {
//   try {
//     // const users = await getCollectionFromJsonFile("users");
//     // if (users instanceof Error)
//     //   throw new Error("Oops... Could not get the users from the Database");
//     // const index = users.findIndex((user) => user._id === userId);
//     // if (index === -1) throw new Error("Could not find user with this ID!");
//     // const usersCopy = [...users];
//     // const userToUpdate = { ...usersCopy[index], ...userForUpdate };
//     // usersCopy[index] = userToUpdate;
//     // const data = await modifyCollection("users", usersCopy);
//     // if (!data)
//     //   throw new Error("Oops... something went wrong Could not Edit this user");
//     // return userToUpdate;
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

// export const deleteUser = async (userId: string) => {
//   try {
//     // const users = await getCollectionFromJsonFile("users");
//     // if (users instanceof Error)
//     //   throw new Error("Oops... Could not get the users from the Database");
//     // const user = users.find((user) => user._id === userId);
//     // if (!user) throw new Error("Could not find user with this ID!");
//     // const filteredUser = users.filter((user) => user._id !== userId);
//     // const data = await modifyCollection("users", filteredUser);
//     // if (!data)
//     //   throw new Error("Oops... something went wrong Could not Edit this user");
//     // return user;
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

// export const login = async (userFromClient: LoginInterface) => {
//   try {
//     // const users = (await getCollectionFromJsonFile(
//     //   "users"
//     // )) as unknown as UserInterface[];
//     // if (!users)
//     //   throw new Error("Oops... Could not get the users from the Database");
//     // const userInDB = users.find((user) => userFromClient.email === user.email);
//     // if (!userInDB) throw new Error("The email or password is incorrect!");
//     // const userCopy = { ...userInDB };
//     // if (!comparePassword(userFromClient.password, userCopy.password))
//     //   throw new Error("The email or password is incorrect!");
//     // const token = generateAuthToken(userInDB);
//     // return token;
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };
