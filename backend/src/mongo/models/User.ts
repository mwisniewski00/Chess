import { Schema, model } from 'mongoose';

interface IUser {
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      unique: true,
      required: true,
      type: String,
      minLength: 3,
    },
    email: {
      required: true,
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Incorrect email format",
      ],
    },
    password: {
      required: true,
      type: String,
      minLength: 8,
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one number, one uppercase and one lowercase letter, and at least 8 or more characters",
      ],
    },
  },
  { collection: "users" }
);

const User = model<IUser>("User", userSchema);

export default User;