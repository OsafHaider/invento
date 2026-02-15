import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  productId: mongoose.Types.ObjectId;
  message: string;
  type: "LOW_STOCK";
  isRead: boolean;
  createdAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["LOW_STOCK"],
      default: "LOW_STOCK",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Alert = mongoose.model<IAlert>("Alert", alertSchema);
