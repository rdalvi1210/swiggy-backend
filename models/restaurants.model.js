import { model, Schema } from "mongoose";

const restaurantSchema = Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
    },

    businessName: String,
    cuisineType: String,
    address: String,

    menuItems: [
      {
        name: String,
        price: Number,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

const Restaurant = model("restaurant", restaurantSchema);

export default Restaurant;
