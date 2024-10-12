import { ICategory } from "./categoryInterface";
export interface IProduct {
  _id?: string;
  _doc?: any;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage?: string;
  isAvailable: boolean;
  category: ICategory;
  productAttributes?: Array<{ _id: string; name: string; values: string[] }>;
  stock?: number;
  isScheduledRequired?: boolean;
}
