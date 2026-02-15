import mongoose, { Document, Model } from "mongoose";

export interface IStockTransaction extends Document {
  productId: mongoose.Types.ObjectId;
  type: "IN" | "OUT";
  quantity: number;
  performedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const stockTransactionSchema = new mongoose.Schema<IStockTransaction>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const StockTransaction: Model<IStockTransaction> =
  mongoose.models.StockTransaction ||
  mongoose.model<IStockTransaction>(
    "StockTransaction",
    stockTransactionSchema
  );
