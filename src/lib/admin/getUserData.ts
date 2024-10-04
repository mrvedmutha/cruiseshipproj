import { IUser } from "@/types/userInterface";
import axios from "axios";
const getUserData = async (): Promise<IUser[]> => {
  try {
    const response = await axios.get("/api/users");
    console.log(response.data.data); //TODO remove
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getUserData;
