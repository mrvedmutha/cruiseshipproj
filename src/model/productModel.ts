import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "@/types/productInterface";

const productSchema = new Schema({
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productImage: { type: String },
  isAvailable: { type: Boolean, required: true, default: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  productAttributes: [
    {
      name: { type: String },
      values: [{ type: String }],
    },
  ],
  stock: { type: Number, default: 0 },
  isScheduledRequired: { type: Boolean, default: false },
});

const Product =
  (mongoose.models.Product as mongoose.Model<IProduct & Document>) ||
  mongoose.model<IProduct & Document>("Product", productSchema);

export default Product;
