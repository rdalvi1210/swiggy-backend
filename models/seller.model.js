import { model, Schema } from "mongoose";

const sellerSchema = new Schema(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "seller",
    },

    // ALLOW ALL 3 TYPES
    sellerType: {
      type: String,
      enum: ["food", "restaurant", "grocery"],
      default: "food",
      required: true,
    },

    // Links to FoodStore OR Restaurant OR Grocery model
    sellerTypeId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

export default model("seller", sellerSchema);
