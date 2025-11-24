import { model, Schema } from "mongoose";

const grocerySchema = Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
    },

    storeName: String,
    warehouseLocation: String,

    inventory: [
      {
        itemName: String,
        price: Number,
        stock: Number,
        unit: String,
      },
    ],
  },
  { timestamps: true }
);

const Grocery = model("grocery", grocerySchema);

export default Grocery;
