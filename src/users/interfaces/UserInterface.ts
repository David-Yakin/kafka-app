import { ObjectId } from "mongoose";

interface UserInterface {
  _id?: string;
  isAdmin: boolean;
  email: string;
  password: string;
}

export type LoginInterface = Pick<UserInterface, "email" | "password">;

export default UserInterface;
