import Order from "@/model/orderModel";
import { getNextOrderId } from "./getNextOrderId";

export const orderService = {
  async createOrder(
    orderDate: Date,
    status: string,
    user: string,
    products: any
  ) {
    const nextOrderId = await getNextOrderId();
    const orderID = `ORD${String(nextOrderId).padStart(4, "0")}`;
    console.log(orderID); //
    const newOrder = new Order({ orderID, orderDate, status, user, products });
    console.log(newOrder);
    await newOrder.save();
  },
  async getOrder() {
    return await Order.find({});
  },
  async getOrderById(id: string) {
    return await Order.findById(id);
  },
  async updateOrderById(id: string, updateData: any) {
    return await Order.findByIdAndUpdate(id, updateData, { new: true });
  },
  async deleteOrderById(id: string) {
    return await Order.findByIdAndDelete(id);
  },
};
