import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "@/types/userInterface";
import { Roles } from "@/types/enumExports";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(Roles),
  },
  accountCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  accountExpires: {
    type: Date,
  },
});

const User =
  (mongoose.models.User as mongoose.Model<IUser & Document>) ||
  mongoose.model<IUser & Document>("User", userSchema);

export default User;
