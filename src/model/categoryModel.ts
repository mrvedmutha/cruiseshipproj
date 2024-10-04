import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "@/types/categoryInterface";

const categorySchema = new Schema({
  categoryName: { type: String, required: true },
  categoryDescription: { type: String, required: true },
  isProduct: { type: Boolean, required: true },
});

const Category =
  (mongoose.models.Category as mongoose.Model<ICategory & Document>) ||
  mongoose.model<ICategory & Document>("Category", categorySchema);

export default Category;
