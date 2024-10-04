import Order from "@/model/orderModel";

export const orderService = {
  async createOrder(
    orderID: string,
    orderDate: Date,
    status: string,
    user: string,
    products: any
  ) {
    const newOrder = new Order({ orderID, orderDate, status, user, products });
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
