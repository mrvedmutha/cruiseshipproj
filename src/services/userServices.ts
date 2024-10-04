import User from "@/model/userModel";

export const userService = {
  async createUser(
    username: string,
    fullName: string,
    password: string,
    email: string,
    role: string,
    accountExpires: Date
  ) {
    const newUser = new User({
      username,
      fullName,
      password,
      email,
      role,
      accountExpires,
    });
    await newUser.save();
  },
  async getUser() {
    return await User.find({});
  },
  async getUserById(id: string) {
    return await User.findById(id);
  },
  async getUserByUsername(username: string) {
    return await User.findOne({ username });
  },
  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  },
  async updateUserById(id: string, updateData: any) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  },
  async deleteUserById(id: string) {
    return await User.findByIdAndDelete(id);
  },
};
