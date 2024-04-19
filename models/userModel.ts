import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: "string",
    required: true,
  },
  lastName: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  location: {
    type: "string",
  },
  age: {
    type: "number",
  },
  workDetails: {
    type: Schema.Types.ObjectId,
    ref: "WorkDetails",
  },
  validated: {
    type: "boolean",
    default: false,
  },
  createdAt: {
    type: "date",
    default: Date.now,
  },
});

const User = model("User", userSchema);
export default User;
