import { model, Schema } from "mongoose";

const foodStoreSchema = Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
    },

    storeName: String,
    category: String,

    productList: [
      {
        name: String,
        price: Number,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

const FoodStore = model("foodstore", foodStoreSchema);

export default FoodStore;
