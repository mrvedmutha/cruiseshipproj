import { Roles } from "./enumExports";
export interface IUser {
  _id?: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: Roles;
  accountCreated: Date;
  accountExpires?: Date;
}
