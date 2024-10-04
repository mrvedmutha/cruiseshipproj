import mongoose, { Schema, Document } from "mongoose";
import { IOrder } from "@/types/orderInterface";
import { Status } from "@/types/enumExports";

const orderSchema = new Schema({
  orderID: { type: String, required: true },
  orderDate: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(Status),
    default: "PENDING",
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const Order =
  (mongoose.models.Order as mongoose.Model<IOrder & Document>) ||
  mongoose.model<IOrder & Document>("Order", orderSchema);

export default Order;
