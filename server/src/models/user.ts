import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  refreshToken: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default:"user"
    },
    refreshToken: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:"RefreshToken",
      default:null

    }]
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", userSchema);
