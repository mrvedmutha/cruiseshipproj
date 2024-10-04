import { IProduct } from "@/types/productInterface";
import axios from "axios";

export const getProductData = async (): Promise<IProduct[]> => {
  try {
    const response = await axios.get("/api/products");
    console.log(response.data.data); //TODO remove
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
