import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  device?: string; // optional, e.g., "Chrome on Windows"
  ipAddress?: string; // optional
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt?: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    device: { type: String },
    ipAddress: { type: String },
    expiresAt: { type: Date, required: true },
    lastUsedAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } } 
);

// Index to quickly find valid tokens for a user
refreshTokenSchema.index({ userId: 1, token: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

export const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);
