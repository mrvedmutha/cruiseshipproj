import { IProduct } from "./productInterface";
import { IUser } from "./userInterface";
import { Status } from "./enumExports";

export interface IOrder {
  orderID: string;
  orderDate: Date;
  status: Status;
  user: IUser;
  products: IOrderProductQuantity[];
}

export interface IOrderProductQuantity {
  product: IProduct;
  quantity: number;
}
