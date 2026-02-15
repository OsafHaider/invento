import mongoose, { Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image?: string | null;
  sku_code: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  lowStockThreshold:number
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 0 },
    category: { type: String, required: true },
    image: { type: String, default: null },
    sku_code: { type: String, unique: true, required: true },
    lowStockThreshold: {
  type: Number,
  default: 5
},
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);
