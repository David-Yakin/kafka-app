import { object } from "joi";
import UserInterface from "../interfaces/UserInterface";

export const normalizeUserForCache = (user: any) => {
  if (typeof user !== "object") throw new Error("'user' mast be an object!");
  if (!user._id && !user.email && !user.password && !user.isAdmin)
    throw new Error(
      "'user' mast contain the following key: _id, email, password, isAdmin"
    );

  return {
    _id: user._id as unknown as string,
    email: user.email,
    password: user.password,
    isAdmin: user.isAdmin,
  };
};

export const normalizedUsersForCache = (users: any[]) => {
  return users.map(<T extends UserInterface>(user: T) =>
    normalizeUserForCache(user)
  );
};
