import { Schema, model } from "mongoose";

const cartItemSchema = new Schema({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "foodstore",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true, // product inside productList
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true, // one cart per user
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default model("cart", cartSchema);
