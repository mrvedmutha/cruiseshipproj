import mongoose, { Schema, Document } from "mongoose";
import { ICounter } from "@/types/counterInterface";

const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  sequenceValue: { type: Number, required: true },
});

const Counter =
  (mongoose.models.Counter as mongoose.Model<ICounter & Document>) ||
  mongoose.model<ICounter & Document>("Counter", counterSchema);

export default Counter;
