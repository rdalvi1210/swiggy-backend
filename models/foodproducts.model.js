import { Schema } from "mongoose";

export const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, default: "" },

    isVeg: { type: Boolean, default: false },

    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    }, // pizza / burger / fries etc.
  },
  { _id: true }
);
