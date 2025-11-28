import { model, Schema } from "mongoose";
import { productSchema } from "./foodproducts.model.js";

const foodStoreSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },

    storeName: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
    },

    cuisines: {
      type: [String],
      default: [], // ["Pizza", "Fast Food", "Snacks"]
    },

    deliveryTime: {
      type: String,
      default: "",
    },

    openingTime: {
      type: String,
      default: "",
    },

    closingTime: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    productList: [productSchema],
  },
  { timestamps: true }
);

const FoodStore = model("foodstore", foodStoreSchema);

export default FoodStore;
