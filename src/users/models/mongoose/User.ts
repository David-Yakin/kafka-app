import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    minLength: 5,
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
    maxLength: 20,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = model("user", UserSchema);

export default User;
