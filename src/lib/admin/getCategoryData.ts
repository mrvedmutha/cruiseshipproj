import { ICategory } from "@/types/categoryInterface";
import axios from "axios";

export const getCategoryData = async (): Promise<ICategory[]> => {
  try {
    const response = await axios.get("/api/category");
    console.log(response.data.data); //TODO remove
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
